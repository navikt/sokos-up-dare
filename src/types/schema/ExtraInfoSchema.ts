import { z } from "zod";

export const ExtraInfoTypes = {
	TekstExtraInfo: "no.nav.sokos.dare.poc.beregning.TekstExtraInfo",
};

export const ExtraInfoValueSchema = z.object({
	verdi: z.string(),
	skjult: z.boolean().optional(),
});

export const TekstExtraInfoSchema = z.object({
	type: z.literal(ExtraInfoTypes.TekstExtraInfo),
	grunn: z.string(),
	tekst: z.string(),
	verdier: z.record(z.string(), ExtraInfoValueSchema),
});

export const ExtraInfoSchema = z.discriminatedUnion("type", [
	TekstExtraInfoSchema,
]);
