import { z } from 'zod';

import { getStatisticsByCategorySchema } from './statisticsApi.contracts';

export type GetStatisticsByCategory = z.TypeOf<
  typeof getStatisticsByCategorySchema
>;
