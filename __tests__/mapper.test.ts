import { describe, expect, test } from "vitest";
import { NftMetadata, NftPrice } from "@/types/nft";
import {
  MOCK_GET_LISTINGS_RESPONSE,
  MOCK_LIST_NFTS_RESPONSE,
} from "./mockData.js";
import { toNftMetadata, toNftPrice } from "@/lib/mapper";

const MON_PRICE_IN_USD = 0.03;

describe("NFTの価格パースをテスト", () => {
  test("正常にパースできること", () => {
    const actual: Record<string, NftPrice> = toNftPrice(
      MOCK_GET_LISTINGS_RESPONSE.listings,
      MON_PRICE_IN_USD,
    );
    // console.info({ actual });
  });
});

describe("NFTのメタデータパースをテスト", () => {
  test("正常にパースできること", () => {
    const actual: Record<string, NftMetadata> = toNftMetadata(
      MOCK_LIST_NFTS_RESPONSE.nfts,
    );
    console.info({ actual });
    expect(actual.hasOwnProperty("1001")).toBe(true);
    expect(actual["1001"].treasuryDust).toBe(43.9);

    expect(actual.hasOwnProperty("1002")).toBe(true);
    expect(actual["1002"].treasuryDust).toBe(1612.38);
  });
});
