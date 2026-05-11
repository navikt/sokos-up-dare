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
	ekstra: z.array(ExtraInfoSchema).optional(),
});

export const DatoIntervallSchema = z.object({
	fom: z.string(),
	tom: z.string().optional(),
});

export const DelberegningSchema = z.object({
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
	delberegninger: z.array(DelberegningSchema),
	gjelder: z.number(),
	fagomraade: z.string(),
	fagsystem: z.string().optional(),
	forfall: z.string().optional(),
	overfoeres: z.string().optional(),
	kid: z.string().optional(),
	bankkonto: z.string().optional(),
	oppdrag: z.number().optional(),
	utbetalesTil: z.number().optional(),
	refunderesTil: z.number().optional(),
	beloepTilUtbetaling: z.number(),
	beregnet: z.string(),
	id: z.number().optional(),
});

export const SatsBoetteSchema = z.object({
	trekkperiodeId: z.number(),
	boette: z.string(),
	restSats: z.number(),
});

export const SaldoBoetteSchema = z.object({
	trekkperiodeId: z.number(),
	boette: z.string(),
	restSaldo: z.number(),
});

export const BeregningspresentasjonSchema = z.object({
	periode: DatoIntervallSchema,
	beregninger: z.array(BeregningSchema),
	saldoBoetter: z.array(SaldoBoetteSchema),
	satsBoetter: z.array(SatsBoetteSchema),
	initielleSaldoBoetter: z.array(SaldoBoetteSchema),
	initielleSatsBoetter: z.array(SatsBoetteSchema),
});

export const BeregningListSchema = z.array(BeregningSchema);
