import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.password(),
});

export class CreateUserDto extends createZodDto(createUserSchema) {}
