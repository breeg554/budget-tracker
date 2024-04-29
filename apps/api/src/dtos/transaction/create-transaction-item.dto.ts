import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { TransactionItemType } from '~/dtos/transaction/transaction-item-type.enum';

export const createTransactionItemSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(TransactionItemType),
  amount: z.number(),
  value: z.number(),
  category: z.string(),
});

export class CreateTransactionItemDto extends createZodDto(
  createTransactionItemSchema,
) {}
