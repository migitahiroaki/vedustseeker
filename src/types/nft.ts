import { z } from "zod";

export const NftBaseSchema = z.object({
  id: z.string(),
});
export type NftBase = z.infer<typeof NftBaseSchema>;

export const NftMetadataSchema = NftBaseSchema.extend({
  treasuryDust: z.number(),
  imageUrl: z.string().nullable(),
  rarity: z
    .union([
      z.literal("Common"),
      z.literal("Fine"),
      z.literal("Epic"),
      z.literal("Legendary"),
    ])
    .nullable(),
  archeType: z.string().nullable(),
  character: z.string().nullable(),
});
export type NftMetadata = z.infer<typeof NftMetadataSchema>;

/**
 * NFTごとのMonad建て価格を保持する
 */
export const NftPriceSchema = NftBaseSchema.extend({
  priceInMon: z.number(),
  priceInUsd: z.number(),
});
export type NftPrice = z.infer<typeof NftPriceSchema>;

/**
 * 画面表示用のモデル
 */
export const NftViewSchema = NftMetadataSchema.extend(
  NftPriceSchema.shape,
).extend({
  dustValue: z.number(),
  dustUnitPrice: z.number(),
  diviation: z.number(),
});

export type NftView = z.infer<typeof NftViewSchema>;
