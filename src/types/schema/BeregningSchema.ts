import { z } from "zod";
import { ExtraInfoSchema } from "./ExtraInfoSchema";

export const CapacitySchema = z.object({
  dayCapacity: z.array(z.number()),
  lumpCapacity: z.number(),
});

export const RowSchema = z.object({
  rowName: z.string(),
  rowValue: z.number(),
  columnValues: z.array(z.number()),
  capacity: CapacitySchema.optional(),
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
