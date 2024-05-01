import { z } from "zod";

export const transactionItemCategory = z.object({
  id: z.string(),
  name: z.string(),
});

export const fromTransactionItemCategoriesResponse = z.array(
  transactionItemCategory,
);
