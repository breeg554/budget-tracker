import { createZodDto } from 'nestjs-zod';
import { TransactionType } from '~/dtos/transaction/transaction-type.enum';
import { z } from 'nestjs-zod/z';

export const updateTransactionSchema = z.object({
  name: z.string().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  date: z.string().optional(),
});

export class UpdateTransactionDto extends createZodDto(
  updateTransactionSchema,
) {}
