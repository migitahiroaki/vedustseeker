import {
  NftMetadata,
  NftMetadataSchema,
  NftPrice,
  NftPriceSchema,
  NftProperty,
  NftPropertySchema,
} from "@/types/nft";
import { Listing, NFT } from "@opensea/sdk";
import { formatUnits } from "viem/utils";

/**
 * コレクションすべてのリストをパースして、 id -> NftPrice のマップを返す
 * @param glr
 * @param monPriceInUsd
 * @returns id -> NftPrice
 */
export const toNftPrice = (
  listings: Listing[],
  monPriceInUsd: number,
): Record<string, NftPrice> => {
  // listings が undefined や null の場合、早期リターン
  if (!listings) return {};

  return Object.fromEntries(
    listings
      .map((item): [string, NftPrice] | null => {
        // 深い階層のプロパティを安全に取得
        const tokenId =
          item.protocol_data.parameters.offer[0]?.identifierOrCriteria;
        const currentPrice = item.price?.current;

        // 必要なデータが欠けている場合は null を返して後で除外
        if (!tokenId || !currentPrice) return null;

        // 文字列の数値を安全に変換
        const priceInMon = Number(
          formatUnits(BigInt(currentPrice.value), currentPrice.decimals),
        );
        const priceInUsd = priceInMon * monPriceInUsd;

        return [
          tokenId,
          NftPriceSchema.parse({
            id: tokenId,
            priceInMon,
            priceInUsd,
          }),
        ];
      })
      // 型ガードを用いて null を除外し、戻り値の型を確定させる
      .filter((entry): entry is [string, NftPrice] => entry !== null),
  );
};

/**
 * コレクションすべてのNFTメタデータをパースして、 id -> NftMetadata のマップを返す
 * @param glr
 * @returns id -> NftMetadata
 */
export const toNftMetadata = (gnmr: NFT[]): Record<string, NftMetadata> => {
  const parseResults = gnmr
    .map((item): [string, NftMetadata] | null => {
      const id = item.identifier;
      const traitTreasuryDust = item.traits?.find(
        (trait) => trait.trait_type === "Treasury (DUST)",
      );
      const treasuryDust = traitTreasuryDust
        ? Number(traitTreasuryDust.value)
        : 0;
      const rarity =
        item.traits
          ?.find((trait) => trait.trait_type === "Level")
          ?.value?.toString() || null;
      const archeType =
        item.traits
          ?.find((trait) => trait.trait_type === "Archetype")
          ?.value?.toString() || null;
      const character =
        item.traits
          ?.find((trait) => trait.trait_type === "Character")
          ?.value?.toString() || null;
      return [
        id,
        NftMetadataSchema.parse({
          id,
          treasuryDust,
          imageUrl: item.image_url || null,
          rarity,
          archeType,
          character,
        }),
      ];
    })
    .filter((entry): entry is [string, NftMetadata] => entry !== null);
  // 型ガードを用いて null を除外し、戻り値の型を確定させる
  console.debug(parseResults);
  return Object.fromEntries(parseResults);
};

export const toNftProperty = (
  nftMetaData: Record<string, NftMetadata>,
  nftPrice: Record<string, NftPrice>,
) => {
  const ids = Object.keys(nftMetaData);
  const parseResults: [string, NftProperty][] = ids
    .map((id: string) => {
      const meta: NftMetadata | undefined = nftMetaData[id];
      const price: NftPrice | undefined = nftPrice[id];

      if (!meta || !price) {
        return null;
      }

      return [
        id,
        NftPropertySchema.parse({
          ...meta,
          ...price,
        }),
      ];
    })
    .filter((entry): entry is [string, NftProperty] => entry !== null);

  return Object.fromEntries(parseResults);
};
