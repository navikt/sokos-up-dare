import { z } from "zod";

export const SkattetrekkSchema = z.object({
	tabellNummer: z.string().optional(),
	prosentSats: z.string().optional(),
	skattetrekkType: z.enum(["tabelltrekk", "prosenttrekk"]),
});
