import { z } from "zod";

export const RowSchema = z.object({
  rowName: z.string(),
  singleVal: z.boolean(),
  values: z.array(z.number()),
});

export const BeregningSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(RowSchema),
  sums: RowSchema,
  sumColumn: z.array(z.number()),
});
