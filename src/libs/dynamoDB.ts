import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchGetCommandInput } from "@aws-sdk/lib-dynamodb";
import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { AppEnv } from "@/libs/appEnv";
import { NftMetadata, NftMetadataSchema } from "@/types/nft";

export class DynamoDB {
  private tableName: string;
  private client: DynamoDBDocumentClient;

  constructor(appEnv: AppEnv) {
    this.tableName = appEnv.dynamodbTableName;
    this.client = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: appEnv.dynamodbRegion,
        endpoint: appEnv.dynamodbEndpoint,
        requestHandler: {
          requestTimeout: 1000,
          connectionTimeout: 500,
          socketTimeout: 500,
        },
      }),
    );
  }

  /**
   * IDを指定してバルク削除
   * @param ids 削除対象ID
   */
  public async deleteByIds(ids: string[]): Promise<void> {
    if (0 === ids.length) return;
    const res = await this.client.send(
      new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: ids.map((id) => ({
            DeleteRequest: {
              Key: { id },
            },
          })),
        },
      }),
    );
    const unprocessedItems = res.UnprocessedItems;
    console.warn("DynamoDBから削除できなかったitems:", unprocessedItems);
  }

  public async fetchByIds(ids: string[]): Promise<Record<string, NftMetadata>> {
    // 自作の安全なバッチ関数を呼ぶだけ
    const rawItems = await this.safeBatchGet<any>(
      this.client,
      this.tableName,
      ids,
    );

    // パースしてIDをキーとしたオブジェクトに変換
    return rawItems.reduce(
      (acc, item) => {
        acc[item.id] = NftMetadataSchema.parse(item);
        return acc;
      },
      {} as Record<string, NftMetadata>,
    );
  }

  /**
   * DynamoDBにレコードを保存する
   * @param item レコード
   * @returns 保存したアイテム
   */
  public async putItems(items: NftMetadata[]): Promise<void> {
    console.debug("保存対象アイテム", items);
    if (items.length == 0) return;
    const res = await this.client.send(
      new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: items.map((item) => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      }),
    );
    // TODO: 必要に応じてリトライ
    if (res.UnprocessedItems && Object.keys(res.UnprocessedItems).length > 0) {
      console.warn(
        "一部のアイテムが処理されませんでした:",
        res.UnprocessedItems,
      );
    }
  }

  private async safeBatchGet<T>(
    client: DynamoDBDocumentClient,
    tableName: string,
    ids: string[],
  ): Promise<T[]> {
    const CHUNK_SIZE = 100;
    const results: T[] = [];

    // 100件ずつチャンクに分割
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      const chunkIds = ids.slice(i, i + CHUNK_SIZE);

      // 型を明示的に指定することで、動的キー [tableName] によるエラーを防ぐ
      let requestItems: NonNullable<BatchGetCommandInput["RequestItems"]> = {
        [tableName]: {
          Keys: chunkIds.map((id) => ({ id })),
        },
      };

      // UnprocessedKeysが空になるまで再試行するループ
      while (Object.keys(requestItems).length > 0) {
        const res = await client.send(
          new BatchGetCommand({ RequestItems: requestItems }),
        );

        // 取得できたアイテムを結果配列に追加
        const fetchedItems = (res.Responses?.[tableName] as T[]) || [];
        results.push(...fetchedItems);

        // 処理しきれなかったキーがあれば、次のループで再リクエスト
        const unprocessed = res.UnprocessedKeys?.[tableName];

        if (unprocessed?.Keys && unprocessed.Keys.length > 0) {
          console.warn(
            `UnprocessedKeysを検知。${unprocessed.Keys.length}件を再試行します...`,
          );
          // SDKが返す型を再代入可能な型にキャストして保持
          requestItems = {
            [tableName]: {
              Keys: unprocessed.Keys as Record<string, any>[],
            },
          };
        } else {
          // 未処理キーが無ければこのチャンクは完了
          requestItems = {};
        }
      }
    }

    return results;
  }
}
