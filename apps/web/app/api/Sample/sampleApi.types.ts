import { z } from "zod";
import { todoSchema } from "./sampleApi.contracts";

export type Todo = z.TypeOf<typeof todoSchema>;
