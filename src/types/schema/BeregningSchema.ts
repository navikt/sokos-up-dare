import { z } from "zod";
import { ExtraInfoSchema } from "./ExtraInfoSchema";

export const RowSchema = z.object({
  rowName: z.string(),
  singleVal: z.boolean(),
  values: z.array(z.number()),
  ekstra: z.array(ExtraInfoSchema).optional(),
});

export const BeregningSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(RowSchema),
  sums: RowSchema,
  sumColumn: z.array(z.number()),
});
