import { z } from 'zod';

import { signInSchema, signUpSchema } from './authApi.contracts';

export type SignUpBody = z.TypeOf<typeof signUpSchema>;

export type SignInBody = z.TypeOf<typeof signInSchema>;
