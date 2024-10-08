import { z } from 'zod';

import { Category } from '~/utils/Category';
import { MonetaryValue } from '~/utils/MonetaryValue';

export const getStatisticsByCategorySchema = z
  .object({
    name: z.string(),
    id: z.string(),
    total: z.union([
      z.number(),
      z.string().transform((value) => parseFloat(value)),
    ]),
    prevTotal: z.union([
      z.number(),
      z.string().transform((value) => parseFloat(value)),
    ]),
  })
  .transform((val) => {
    return {
      ...val,
      icon: new Category(val).icon,
      total: new MonetaryValue(val.total).toJSON(),
      prevTotal: new MonetaryValue(val.prevTotal).toJSON(),
      percentageDifference: new MonetaryValue(val.total).percentageDifference(
        new MonetaryValue(val.prevTotal),
      ),
    };
  });

export const fromGetStatisticsByCategoryResponse = z.array(
  getStatisticsByCategorySchema,
);
