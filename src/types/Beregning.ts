import type { z } from "zod";
import type {
	BeregningSchema,
	BeregningspresentasjonSchema,
	CapacitySchema,
	DelberegningSchema,
	RowSchema,
} from "./schema/BeregningSchema";
import type {
	ExtraInfoSchema,
	ExtraInfoValueSchema,
} from "./schema/ExtraInfoSchema";

export type Beregningspresentasjon = z.infer<
	typeof BeregningspresentasjonSchema
>;
export type Beregning = z.infer<typeof BeregningSchema>;
export type Delberegning = z.infer<typeof DelberegningSchema>;

export type Capacity = z.infer<typeof CapacitySchema>;

export type Row = z.infer<typeof RowSchema>;

export type ExtraInfo = z.infer<typeof ExtraInfoSchema>;
export type ExtraInfoValue = z.infer<typeof ExtraInfoValueSchema>;
