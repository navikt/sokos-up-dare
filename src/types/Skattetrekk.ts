import { z } from "zod";
import { Skattetrekk } from "./schema/Skattetrekk";

export type Skattetrekk = z.infer<typeof Skattetrekk>;
