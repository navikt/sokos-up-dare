import { z } from "zod";
import { TrekkSchema } from "./schema/TrekkSchema";

export type Trekk = z.infer<typeof TrekkSchema>;
export type TrekkAlternativ = Trekk["trekkAlternativ"];
