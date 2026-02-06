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

export const DatoIntervallSchema = z.object({
	fom: z.string(),
	tom: z.string().optional(),
});

export const DelperiodeSchema = z.object({
	columns: z.array(z.string()),
	rows: z.array(RowSchema),
	datoIntervall: DatoIntervallSchema,
	sums: RowSchema,
	sumColumn: z.array(z.number()),
	extraInfo: z
		.array(z.union([ExtraInfoSchema, z.object({}).passthrough()]))
		.optional(),
});

export const BeregningSchema = z.object({
	periode: DatoIntervallSchema,
	gjelder: z.number(),
	fagomraade: z.string(),
	fagsystem: z.string().optional(),
	forfall: z.string().optional(),
	overfoeres: z.string().optional(),
	kid: z.string().optional(),
	bankkonto: z.string().optional(),
	oppdrag: z.string().optional(),
	utbetalesTil: z.number().optional(),
	refunderesTil: z.number().optional(),
	delperioder: z.array(DelperiodeSchema),
	beloepTilUtbetaling: z.number(),
});
