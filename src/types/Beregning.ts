import { z } from "zod";
import { BeregningSchema, RowSchema } from "./schema/BeregningSchema";
import {
  ExtraInfoSchema,
  OverstyrtSkatteKortExtraInfoSchema,
  ProsentExtraInfoSchema,
  TabellExtraInfoSchema,
} from "./schema/ExtraInfoSchema";

export type Beregning = z.infer<typeof BeregningSchema>;

export type Row = z.infer<typeof RowSchema>;

export type ExtraInfo = z.infer<typeof ExtraInfoSchema>;

export type ExtraInfoValueType = string | number | Date | boolean | string[];

export type OverstyrtSkatteKortExtraInfo = z.infer<
  typeof OverstyrtSkatteKortExtraInfoSchema
>;
export type TabellExtraInfo = z.infer<typeof TabellExtraInfoSchema>;
export type ProsentExtraInfo = z.infer<typeof ProsentExtraInfoSchema>;
