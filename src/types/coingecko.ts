import { z } from "zod";

export const PriceSchema = z.object({
  usd: z.number(),
});

export const CoingeckoPriceResponseSchema = z.record(z.string(), PriceSchema);
export type CoingeckoPriceResponse = z.infer<
  typeof CoingeckoPriceResponseSchema
>;
