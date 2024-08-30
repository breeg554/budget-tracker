import { z } from 'zod';

import { userMeSchema } from './userApi.contracts';

export type UserMeDto = z.TypeOf<typeof userMeSchema>;
