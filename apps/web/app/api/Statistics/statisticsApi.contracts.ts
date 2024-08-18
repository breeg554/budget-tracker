import { z } from 'zod';

export const getStatisticsByCategorySchema = z.object({
  category: z.string(),
  total: z.union([
    z.number(),
    z.string().transform((value) => parseFloat(value)),
  ]),
});

export const fromGetStatisticsByCategoryResponse = z.array(
  getStatisticsByCategorySchema,
);
