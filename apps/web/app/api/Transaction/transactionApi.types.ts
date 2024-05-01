import { z } from "zod";
import { transactionItemCategory } from "./transactionApi.contracts";

export type TransactionItemCategory = z.TypeOf<typeof transactionItemCategory>;
