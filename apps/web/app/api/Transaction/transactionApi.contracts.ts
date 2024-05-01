import { z } from "zod";

export const transactionItemCategory = z.object({
  id: z.string(),
  name: z.string(),
});

export const fromTransactionItemCategoriesResponse = z.array(
  transactionItemCategory,
);

export enum TransactionItemType {
  OUTCOME = "outcome",
  INCOME = "income",
}

export const createTransactionItemSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(TransactionItemType),
  amount: z.number().min(0),
  value: z.number().min(0),
  category: z.string(),
});

export type CreateTransactionItemSchema = z.TypeOf<
  typeof createTransactionItemSchema
>;

export enum TransactionType {
  PURCHASE = "purchase",
}

export const createTransactionSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(TransactionType),
  date: z.string(),
  value: z.number().min(0),
  items: z.array(createTransactionItemSchema),
});

export type CreateTransactionSchema = z.TypeOf<typeof createTransactionSchema>;
