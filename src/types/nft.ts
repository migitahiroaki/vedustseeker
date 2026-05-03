import { z } from "zod";

export const NftBaseSchema = z.object({
  id: z.string(),
});
export type NftBase = z.infer<typeof NftBaseSchema>;

export const NftMetadataSchema = NftBaseSchema.extend({
  treasuryDust: z.number().nullable(),
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
  priceInUsd: z.number().nullable(),
});
export type NftPrice = z.infer<typeof NftPriceSchema>;

/**
 * NFTプロパティのモデル
 */
export const NftPropertySchema = NftMetadataSchema.extend(
  NftPriceSchema.shape,
).extend(NftBaseSchema.shape);
export type NftProperty = z.infer<typeof NftPropertySchema>;
