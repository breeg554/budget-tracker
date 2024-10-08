import { z } from 'zod';

import { Category } from '~/utils/Category';
import { MonetaryValue, TransactionItemValue } from '~/utils/MonetaryValue';

export const transactionItemCategory = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .transform((category) => new Category(category).toJSON());

export const fromTransactionItemCategoriesResponse = z.array(
  transactionItemCategory,
);

export enum TransactionItemType {
  OUTCOME = 'outcome',
  INCOME = 'income',
}

export const createTransactionItemSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(TransactionItemType),
  quantity: z.number().min(0),
  price: z.number().min(0),
  category: z.string().uuid('Incorrect category'),
});

export enum TransactionType {
  PURCHASE = 'purchase',
}

export const createTransactionSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(TransactionType),
  date: z.string(),
  items: z.array(createTransactionItemSchema),
});

export const getTransactionItemCategorySchema = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .transform((category) => new Category(category).toJSON());

export const getTransactionItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.nativeEnum(TransactionItemType),
    quantity: z.union([z.number(), z.string().transform((val) => Number(val))]),
    price: z.union([z.number(), z.string().transform((val) => Number(val))]),
    createdAt: z.string(),
    updatedAt: z.string(),
    category: getTransactionItemCategorySchema,
  })
  .transform(({ quantity, price, ...rest }) => {
    return {
      ...rest,
      price: new TransactionItemValue(
        new MonetaryValue(price),
        quantity,
      ).toJSON(),
    };
  });

export const getTransactionSchema = z
  .object({
    id: z.string(),
    type: z.nativeEnum(TransactionType),
    date: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    items: z.array(getTransactionItemSchema),
    author: z.object({
      email: z.string(),
      id: z.string(),
    }),
    price: z.number(),
    name: z.string(),
  })
  .transform((val) => ({
    ...val,
    price: new MonetaryValue(val.price).toJSON(),
  }));

export const fromGetTransactionsResponse = z.array(getTransactionSchema);
