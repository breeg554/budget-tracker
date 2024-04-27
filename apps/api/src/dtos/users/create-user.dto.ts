import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.password(),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
