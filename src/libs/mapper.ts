import { LockedData } from "@/types/contract";
import {
  NftMetadata,
  NftMetadataSchema,
  NftPrice,
  NftPriceSchema,
  NftViewSchema,
} from "@/types/nft";
import { GetNFTMetadataResponse, Listing } from "@opensea/sdk";
import { formatUnits } from "viem/utils";

const DUST_AMOUNT_DECIMALS_UNIT = 18;

export class Mapper {
  /**
   * コレクションすべてのリストをパースして、 id -> NftPrice のマップを返す
   * @param glr
   * @param monPriceInUsd
   * @returns id -> NftPrice
   */
  public static toNftPrice = (
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
  public static toNftMetadata = (
    metaData: Record<string, GetNFTMetadataResponse>,
    lockedData: Record<number, LockedData>,
  ): Record<string, NftMetadata> => {
    const ids = Object.keys(lockedData);

    const entries = ids.map((id) => {
      const md = metaData[id];
      const treasuryDust = +formatUnits(
        BigInt(lockedData[Number(id)].amount),
        DUST_AMOUNT_DECIMALS_UNIT,
      );
      const rarity =
        md.traits
          ?.find((trait) => trait.trait_type === "Level")
          ?.value?.toString() || null;
      const archeType =
        md.traits
          ?.find((trait) => trait.trait_type === "Archetype")
          ?.value?.toString() || null;
      const character =
        md.traits
          ?.find((trait) => trait.trait_type === "Character")
          ?.value?.toString() || null;
      return [
        id,
        NftMetadataSchema.parse({
          id,
          treasuryDust,
          imageUrl: md.image,
          rarity,
          archeType,
          character,
        }),
      ];
    });
    return Object.fromEntries(entries);
  };

  public static toNftView(
    metaData: Record<string, NftMetadata>,
    priceData: Record<string, NftPrice>,
    monPriceInUsd: number,
    dustPriceInUsd: number,
  ) {
    const ids = Object.keys(metaData);

    const entries = ids.map((id) => {
      // USD建て価格を計算
      const priceInUsd = priceData[id].priceInMon * monPriceInUsd;
      // 実質価値を計算
      const dustValue = metaData[id].treasuryDust * dustPriceInUsd;
      // DUST単価を計算
      const dustUnitPrice = priceInUsd / metaData[id].treasuryDust;
      // 割引率を計算
      const diviation = priceInUsd / dustValue - 1;

      return [
        id,
        NftViewSchema.parse({
          ...metaData[id],
          ...priceData[id],
          dustValue,
          dustUnitPrice,
          diviation,
        }),
      ];
    });

    return Object.fromEntries(entries);
  }
}
