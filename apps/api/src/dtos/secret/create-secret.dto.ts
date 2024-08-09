import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createSecretSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export class CreateSecretDto extends createZodDto(createSecretSchema) {}
