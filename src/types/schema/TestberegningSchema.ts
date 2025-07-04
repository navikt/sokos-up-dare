import { z } from "zod";

export const TestberegningSchema = z.object({
  oppdragsXmlVersjon: z.string(),
  oppdragsXml: z.string(),
  skattetrekkType: z.enum(["tabelltrekk", "prosenttrekk"]),
  tabellNummer: z.string().optional(),
  prosentSats: z.string().optional(),
});
