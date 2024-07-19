import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { getTransactionItemCategorySchema } from '~/dtos/transaction/get-transaction-item-category.dto';
import { TransactionItemType } from '~/dtos/transaction/transaction-item-type.enum';

export const getTransactionItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(TransactionItemType),
  quantity: z.number(),
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  category: getTransactionItemCategorySchema,
});

export class GetTransactionItemDto extends createZodDto(
  getTransactionItemSchema,
) {}
