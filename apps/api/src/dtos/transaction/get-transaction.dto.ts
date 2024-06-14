import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { getTransactionItemSchema } from '~/dtos/transaction/get-transaction-item.dto';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';
import { getUserSchema } from '~/dtos/users/get-user.dto';

export const getTransactionSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(TransactionType),
  date: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(getTransactionItemSchema),
  value: z.number(),
  author: getUserSchema,
});

export class GetTransactionDto extends createZodDto(getTransactionSchema) {}
