import type { z } from "zod";
import type { TrekkSchema } from "./schema/TrekkSchema";

export type Trekk = z.infer<typeof TrekkSchema>;
export type TrekkAlternativ = Trekk["trekkAlternativ"];
