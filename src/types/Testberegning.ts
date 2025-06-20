import { z } from "zod";
import { TestberegningSchema } from "./schema/TestberegningSchema";

export type Testberegning = z.infer<typeof TestberegningSchema>;
