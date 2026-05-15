import z from "zod";

export const ConditionSchema = z.object({
  deviationLT: z.coerce.number().optional(),
  dustUnitPriceLT: z.coerce.number().positive().optional(),
});

export type Condition = z.infer<typeof ConditionSchema>;
