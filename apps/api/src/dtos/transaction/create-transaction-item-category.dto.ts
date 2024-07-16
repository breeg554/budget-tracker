import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createTransactionItemCategorySchema = z.object({
  name: z.string(),
});

export class CreateTransactionItemCategoryDto extends createZodDto(
  createTransactionItemCategorySchema,
) {}
