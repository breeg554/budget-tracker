import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(2),
});

export class CreateOrganizationDto extends createZodDto(
  createOrganizationSchema,
) {}
