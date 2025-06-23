import { z } from "zod";
import { Skattetrekk } from "./Skattetrekk";

export const OppdragsbeskrivelseSchema = z.object({
  skattekort: Skattetrekk,
  sats: z.number(),
  vedtaksSats: z.number(),
  datoVedtakFom: z.string(),
  datoVedtakTom: z.string(),
});
