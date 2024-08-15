import { z } from 'zod';

import {
  createOrganizationSchema,
  createSecretSchema,
  getOrganizationSchema,
} from './organizationApi.contracts';

export type GetOrganizationDto = z.TypeOf<typeof getOrganizationSchema>;

export type CreateOrganizationDto = z.TypeOf<typeof createOrganizationSchema>;

export type CreateSecretDto = z.TypeOf<typeof createSecretSchema>;
