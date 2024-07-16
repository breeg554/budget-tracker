import { z } from 'zod';

import {
  createTransactionItemSchema,
  createTransactionSchema,
  getTransactionItemSchema,
  getTransactionSchema,
  transactionItemCategory,
} from './transactionApi.contracts';

export type GetTransactionItemCategoryDto = z.TypeOf<
  typeof transactionItemCategory
>;

export type GetTransactionDto = z.TypeOf<typeof getTransactionSchema>;

export type GetTransactionItemDto = z.TypeOf<typeof getTransactionItemSchema>;

export type CreateTransactionItemDto = z.TypeOf<
  typeof createTransactionItemSchema
>;

export type CreateTransactionDto = z.TypeOf<typeof createTransactionSchema>;
