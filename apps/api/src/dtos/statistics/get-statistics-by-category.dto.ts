import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const getStatisticsByCategory = z.object({
  category: z.string(),
  id: z.string(),
  total: z.number(),
});

export class GetStatisticsByCategoryDto extends createZodDto(
  getStatisticsByCategory,
) {}
