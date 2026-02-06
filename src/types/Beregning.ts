import type { z } from "zod";
import type {
	BeregningSchema,
	CapacitySchema,
	DelperiodeSchema,
	RowSchema,
} from "./schema/BeregningSchema";
import type {
	ExtraInfoSchema,
	OverstyrtSkatteKortExtraInfoSchema,
	ProsentExtraInfoSchema,
	TabellExtraInfoSchema,
} from "./schema/ExtraInfoSchema";

export type Beregning = z.infer<typeof BeregningSchema>;
export type Delperiode = z.infer<typeof DelperiodeSchema>;

export type Capacity = z.infer<typeof CapacitySchema>;

export type Row = z.infer<typeof RowSchema>;

export type ExtraInfo = z.infer<typeof ExtraInfoSchema>;

export type ExtraInfoValueType = string | number | Date | boolean | string[];

export type OverstyrtSkatteKortExtraInfo = z.infer<
	typeof OverstyrtSkatteKortExtraInfoSchema
>;
export type TabellExtraInfo = z.infer<typeof TabellExtraInfoSchema>;
export type ProsentExtraInfo = z.infer<typeof ProsentExtraInfoSchema>;
