import z from "zod";

export const ConditionSchema = z.object({
  diviationLT: z.coerce.number().optional(),
  dustUnitPriceLT: z.coerce.number().positive().optional(),
});

export type Condition = z.infer<typeof ConditionSchema>;
