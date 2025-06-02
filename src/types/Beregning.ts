import { z } from "zod";
import { BeregningSchema, RowSchema } from "./schema/BeregningSchema";

export type Beregning = z.infer<typeof BeregningSchema>;

export type Row = z.infer<typeof RowSchema>;
