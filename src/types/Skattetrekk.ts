import type { z } from "zod";
import type { SkattetrekkSchema } from "./schema/SkattetrekkSchema";

export type Skattetrekk = z.infer<typeof SkattetrekkSchema>;
