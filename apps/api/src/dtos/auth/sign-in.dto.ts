import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const signInSchema = z.object({
  email: z.string(),
  password: z.password(),
});

export class SignInDto extends createZodDto(signInSchema) {}
