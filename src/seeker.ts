import { NftPrice } from "@/types/nft";
import { Coingecko } from "@/libs/coingecko";
import { AppEnv } from "@/libs/appEnv";
import { OpenSea } from "@/libs/openSea";
import { Listing } from "@opensea/sdk";
import { Mapper } from "@/libs/mapper";
import { DynamoDB } from "@/libs/dynamoDB";
import { MonadChain } from "@/libs/monadChain";

export const fetchNftsWithCache = async (appEnv: AppEnv) => {
  const dynamoDb = new DynamoDB(appEnv);
  const openSea = new OpenSea(appEnv);
  const monadChain = new MonadChain();

  // リスト一覧、MONのUSD価格を並行して取得
  const [listings, monPriceInUsd, dustPriceInUsd]: [Listing[], number, number] =
    await Promise.all([
      openSea.fetchAllListing(),
      Coingecko.getMonPriceInUsd(),
      Coingecko.getDustPriceInUsd(),
    ]);

  const nftPrices: Record<string, NftPrice> = Mapper.toNftPrice(
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

  // 新規分のデータ取得
  const [gnmr, lockedData] = await Promise.all([
    openSea.fetchNftsByIds(newIds),
    monadChain.fetchVeDustLockByIds(newIds.map(Number)),
  ]);
  const newMetaData = Mapper.toNftMetadata(gnmr, lockedData);
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
  console.info(JSON.stringify(viewData, null, 2));

  return viewData;
};
