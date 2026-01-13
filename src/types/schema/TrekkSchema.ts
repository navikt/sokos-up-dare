import { z } from "zod";

export const TrekkSchema = z.object({
	beskrivelse: z.string(),
	trekkAlternativ: z.enum(["LOPD", "LOPM", "LOPP", "SALD", "SALM", "SALP"]),
	sats: z.number(),
	skattereduserende: z.boolean(),
	prioritet: z.number(),
	datoFom: z.string(),
	datoTom: z.string(),
});
