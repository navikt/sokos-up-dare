import { z } from "zod";

export const Skattetrekk = z.object({
  tabellNummer: z.string().optional(),
  prosentSats: z.string().optional(),
  skattetrekkType: z.enum(["tabelltrekk", "prosenttrekk"]),
});
