import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const getTransactionItemCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export class GetTransactionItemCategoryDto extends createZodDto(
  getTransactionItemCategorySchema,
) {}
