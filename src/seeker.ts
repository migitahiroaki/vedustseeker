import { NftPrice } from "@/types/nft";
import { Coingecko } from "@/libs/coingecko";
import { AppEnv } from "@/libs/appEnv";
import { OpenSea } from "@/libs/openSea";
import { Listing } from "@opensea/sdk";
import { Mapper } from "@/libs/mapper";
import { DynamoDB } from "@/libs/dynamoDB";
import { MonadChain } from "@/libs/monadChain";
import { Condition } from "@/types/condition";
import { Filter } from "@/libs/filter";

import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import { ConditionSchema } from "./types/condition";

const appEnv = new AppEnv();

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResult> => {
  const condition = ConditionSchema.parse(event.queryStringParameters || {});
  console.debug("フィルタ条件", condition);

  const nfts = await fetchNftsWithCache(appEnv, condition);
  Object.values(nfts).forEach((n) => console.info(n));
  const body = JSON.stringify(nfts);

  return {
    statusCode: 200,
    body,
  };
};

const fetchNftsWithCache = async (appEnv: AppEnv, condition: Condition) => {
  const dynamoDb = new DynamoDB(appEnv);
  const openSea = new OpenSea(appEnv);
  const monadChain = new MonadChain();
  const filter = new Filter(condition);
  const coingecko = new Coingecko(appEnv);

  // リスト一覧、MONのUSD価格を並行して取得
  const [listings, monPriceInUsd, dustPriceInUsd]: [Listing[], number, number] =
    await Promise.all([
      openSea.fetchAllListing(),
      coingecko.getMonPriceInUsd(),
      coingecko.getDustPriceInUsd(),
    ]);

  const nftPrices: Record<string, NftPrice> = Mapper.toNormalizedNftPrice(
    listings,
    monPriceInUsd,
  );
  const ids = Object.keys(nftPrices);
  const existingMetadata = await dynamoDb.fetchByIds(ids);
  const existingIds = Object.keys(existingMetadata);

  // 新規IDを抽出。ただし全件並行フェッチだとクォータ超過するので、件数制限をかける
  const newIds = ids
    .filter((id) => !existingIds.includes(id))
    .slice(0, appEnv.parallelFetchLimit);
  // OpenSeaにないidは削除済みなので、DBからも削除
  const outdatedIds = existingIds.filter((id) => !ids.includes(id));
  console.debug("古くなったIDs", outdatedIds);

  // 新規分のデータ取得
  const [gnmr, lockedData] = await Promise.all([
    openSea.fetchNftsByIds(newIds),
    monadChain.fetchVeDustLockByIds(newIds.map(Number)),
  ]);
  const newMetaData = Mapper.toNftMetadata(gnmr, lockedData);
  console.debug("新規データ", newMetaData);

  // 新規分をDB保存し、なくなったIDを削除
  await Promise.all([
    dynamoDb.putItems(Object.values(newMetaData)),
    dynamoDb.deleteByIds(outdatedIds),
  ]);

  const viewData = Mapper.toNftView(
    { ...existingMetadata, ...newMetaData },
    nftPrices,
    monPriceInUsd,
    dustPriceInUsd,
  );

  const filtered = filter.applied(viewData);
  console.debug("フィルタ後のViewデータ", filtered);
  return filtered;
};
