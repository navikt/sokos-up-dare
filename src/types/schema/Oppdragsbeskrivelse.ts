import { z } from "zod";
import { Skattetrekk } from "./SkattetrekkSchema";
import { TrekkSchema } from "./TrekkSchema";

export const OppdragsbeskrivelseSchema = z.object({
	skattekort: Skattetrekk,
	sats: z.number(),
	vedtaksSats: z.number(),
	datoVedtakFom: z.string(),
	datoVedtakTom: z.string(),
	trekk: z.array(TrekkSchema).optional(),
});
