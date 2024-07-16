import { z } from 'zod';

import { getTransactionSchema } from '~/api/Transaction/transactionApi.contracts';

export const getOrganizationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string(),
  // users: z.array(z.string()),
  // transactions: z.array(getTransactionSchema),
});

export const fromGetOrganizationsResponse = z.array(getOrganizationSchema);

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Name must only contain letters, numbers, underscores, or hyphens.',
    ),
});
