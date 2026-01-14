import type { z } from "zod";
import type { TestberegningSchema } from "./schema/TestberegningSchema";

export type Testberegning = z.infer<typeof TestberegningSchema>;
