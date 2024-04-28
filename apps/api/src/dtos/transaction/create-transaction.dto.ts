import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';

export const createTransactionSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(TransactionType),
  date: z.string(),
});

export class CreateTransactionDto extends createZodDto(
  createTransactionSchema,
) {}
