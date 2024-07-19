import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { TransactionItemType } from '~/dtos/transaction/transaction-item-type.enum';

export const createTransactionItemSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(TransactionItemType),
  quantity: z.number(),
  price: z.number(),
  category: z.string(),
});

export class CreateTransactionItemDto extends createZodDto(
  createTransactionItemSchema,
) {}
