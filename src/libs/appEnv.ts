export class AppEnv {
  /** OpenSeaのAPIキー */
  public readonly openSeaApiKey: string;

  /**
   * MonadチェーンやOpensea取得時の並行フェッチ数リミット
   * @default 10
   */
  public readonly parallelFetchLimit: number;

  /** DynamoDBのテーブル名 */
  public readonly dynamodbTableName: string;

  /** DynamoDBのリージョン
   * @default us-east-1
   */
  public readonly dynamodbRegion: string;
  /**
   * DynamoDBのエンドポイント
   * @default AWS純正のエンドポイント
   */
  public readonly dynamodbEndpoint?: string;

  constructor() {
    const openSeaApiKey = process.env.OPENSEA_API_KEY;

    if (!openSeaApiKey) {
      throw new Error(
        `Opensea API キーが設定されていません。 , ${openSeaApiKey}`,
      );
    }
    this.openSeaApiKey = openSeaApiKey;

    this.parallelFetchLimit = Number.parseInt(
      process.env.PARALLEL_FETCH_LIMIT || "10",
    );

    const dynamodbTableName = process.env.DYNAMODB_TABLE_NAME;
    if (!dynamodbTableName) {
      throw new Error("DYNAMODB_TABLE_NAMEが設定されていません");
    }
    this.dynamodbTableName = dynamodbTableName;

    this.dynamodbRegion = process.env.DYNAMODB_REGION ?? "us-east-1";
    this.dynamodbEndpoint = process.env.DYNAMODB_ENDPOINT;
  }
}
