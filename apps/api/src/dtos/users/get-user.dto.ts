import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const getUserSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string(),
});

export class GetUserDto extends createZodDto(getUserSchema) {}
