import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';
import { createTransactionItemSchema } from '~/dtos/transaction/create-transaction-item.dto';

export const createTransactionSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(TransactionType),
  date: z.string(),
  items: z.array(createTransactionItemSchema),
});

export class CreateTransactionDto extends createZodDto(
  createTransactionSchema,
) {}
