import { z } from 'zod';

import { userSchema } from '~/api/api.contracts';

export const getOrganizationSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string(),
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

export const getSecret = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  name: z.string(),
});

export const fromGetSecretResponse = getSecret;

export const createSecretSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const fromGetOrganizationUsersResponse = z.array(userSchema);
