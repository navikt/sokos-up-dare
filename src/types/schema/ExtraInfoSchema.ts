import { z } from "zod";

export const ExtraInfoReasonSchema = z.enum(["TIDLIGERE_UTBETALT"]);

export const ExtraInfoTypes = {
  OverstyrtSkatteKort:
    "no.nav.sokos.dare.poc.beregning.OverstyrtSkatteKortExtraInfo",
  ProsentExtraInfo: "no.nav.sokos.dare.poc.beregning.ProsentExtraInfo",
  TabellExtraInfo: "no.nav.sokos.dare.poc.beregning.TabellExtraInfo",
};

export const SkatteTrekkTypes = {
  DefaultSkatteTrekk: "no.nav.sokos.dare.poc.skattetrekk.DefaultSkatteTrekk",
  ProsentSkatteTrekk: "no.nav.sokos.dare.poc.skattetrekk.ProsentSkatteTrekk",
  TabellSkatteTrekk: "no.nav.sokos.dare.poc.skattetrekk.TabellSkatteTrekk",
};

export const OverstyrtSkatteKortExtraInfoSchema = z.object({
  type: z.literal(ExtraInfoTypes.OverstyrtSkatteKort),
  grunnlag: z.number(),
  prosentSats: z.string(),
  grunn: ExtraInfoReasonSchema,
});

export const ProsentSkatteTrekkSchema = z.object({
  type: z.literal(SkatteTrekkTypes.ProsentSkatteTrekk),
  prosentSats: z.number(),
  inntektsAar: z.number(),
  skattekortIdentifikator: z.number(),
  utstedtDato: z.string(),
  utsettes: z.boolean(),
  tilleggspplysning: z.array(z.string()).optional(),
});

export const DefaultSkatteTrekkSchema = z.object({
  type: z.literal(SkatteTrekkTypes.DefaultSkatteTrekk),
  fagomraade: z.enum(["AAP"]),
  prosentSats: z.number(),
});

export const ProsentExtraInfoSchema = z.object({
  type: z.literal(ExtraInfoTypes.ProsentExtraInfo),
  grunnlag: z.number(),
  skatteInfo: z.discriminatedUnion("type", [
    ProsentSkatteTrekkSchema,
    DefaultSkatteTrekkSchema,
  ]),
});

export const TabellSkatteTrekkSchema = z.object({
  type: z.literal(SkatteTrekkTypes.TabellSkatteTrekk),
  trekktabell: z.string(),
  inntektsAar: z.number(),
  skattekortIdentifikator: z.number(),
  utstedtDato: z.string(),
});

export const TabellExtraInfoSchema = z.object({
  type: z.literal(ExtraInfoTypes.TabellExtraInfo),
  grunnlag: z.number(),
  skatteInfo: TabellSkatteTrekkSchema,
  skatteDager: z.number(),
});

export const ExtraInfoSchema = z.discriminatedUnion("type", [
  OverstyrtSkatteKortExtraInfoSchema,
  ProsentExtraInfoSchema,
  TabellExtraInfoSchema,
]);
