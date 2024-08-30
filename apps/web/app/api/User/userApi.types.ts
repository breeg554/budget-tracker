import { z } from 'zod';

import { userSchema } from '../api.contracts';

export type UserMeDto = z.TypeOf<typeof userSchema>;
