import { z } from "zod";
import { TrekkSchema } from "./TrekkSchema";

export const TestberegningSchema = z.object({
	oppdragsXmlVersjon: z.string(),
	oppdragsXml: z.string(),
	skattetrekkType: z.enum(["tabelltrekk", "prosenttrekk"]),
	datoFom: z.string(),
	datoTom: z.string(),
	tabellNummer: z.string().optional(),
	prosentSats: z.string().optional(),
	trekk: z.array(TrekkSchema).optional(),
});
