import { z } from 'zod';

export const getStatisticsByCategorySchema = z.object({
  name: z.string(),
  id: z.string(),
  total: z.union([
    z.number(),
    z.string().transform((value) => parseFloat(value)),
  ]),
});

export const fromGetStatisticsByCategoryResponse = z.array(
  getStatisticsByCategorySchema,
);
