import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const getTransactionItemCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export class GetTransactionItemCategoryDto extends createZodDto(
  getTransactionItemCategorySchema,
) {}
