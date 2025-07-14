import { z } from "zod";
import { ExtraInfoSchema } from "./ExtraInfoSchema";

export const RowSchema = z.object({
  rowName: z.string(),
  singleVal: z.boolean(),
  values: z.array(z.number()),
  ekstra: z
    .array(z.union([ExtraInfoSchema, z.object({}).passthrough()]))
    .optional(),
});

export const BeregningSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(RowSchema),
  sums: RowSchema,
  sumColumn: z.array(z.number()),
});
