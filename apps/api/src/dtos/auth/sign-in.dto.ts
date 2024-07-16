import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const signInSchema = z.object({
  email: z.string(),
  password: z.password(),
});

export class SignInDto extends createZodDto(signInSchema) {}
