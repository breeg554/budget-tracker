import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createTransactionItemCategorySchema = z.object({
  name: z.string(),
});

export class CreateTransactionItemCategoryDto extends createZodDto(
  createTransactionItemCategorySchema,
) {}
