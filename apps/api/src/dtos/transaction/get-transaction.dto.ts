import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

import { getTransactionItemSchema } from '~/dtos/transaction/get-transaction-item.dto';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';
import { getUserSchema } from '~/dtos/users/get-user.dto';

export const getTransactionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(TransactionType),
  date: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(getTransactionItemSchema),
  price: z.number(),
  author: getUserSchema.pick({ email: true, id: true }),
});

export class GetTransactionDto extends createZodDto(getTransactionSchema) {}
