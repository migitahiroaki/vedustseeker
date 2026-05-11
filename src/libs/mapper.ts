import { LockedData } from "@/types/contract";
import {
  NftMetadata,
  NftMetadataSchema,
  NftPrice,
  NftPriceSchema,
  NftView,
  NftViewSchema,
} from "@/types/nft";
import { GetNFTMetadataResponse, Listing } from "@opensea/sdk";
import { formatUnits } from "viem/utils";

const DUST_AMOUNT_DECIMALS_UNIT = 18;

export class Mapper {
  /**
   * コレクションすべてのリストをパースして、 id -> NftPrice のマップを返す。
   * 重複の場合は、最新のエントリのみ残す
   *
   * @param glr
   * @param monPriceInUsd
   * @returns id -> NftPrice
   */
  public static toNormalizedNftPrice = (
    listings: Listing[],
    monPriceInUsd: number,
  ): Record<string, NftPrice> => {
    if (!listings) return {};
    return listings.reduce((acc: Record<string, NftPrice>, item: Listing) => {
      const id = item.protocol_data.parameters.offer[0]?.identifierOrCriteria;
      const currentPrice = item.price?.current;
      if (!id || !currentPrice) {
        return acc;
      }
      const updatedAt = Number(item.protocol_data.parameters.startTime);
      const priceInMon = Number(
        formatUnits(BigInt(currentPrice.value), currentPrice.decimals),
      );
      const priceInUsd = priceInMon * monPriceInUsd;
      const newRecord: NftPrice = {
        id,
        priceInMon,
        priceInUsd,
        updatedAt,
      };
      const existingRecord: NftPrice | undefined = acc[id];
      if (!existingRecord || existingRecord.updatedAt < updatedAt) {
        acc[id] = newRecord;
      }
      return acc;
    }, {});
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
  ): Record<string, NftView> {
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
