import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createOrganizationSchema = z.object({
  name: z.string().min(2),
});

export class CreateOrganizationDto extends createZodDto(
  createOrganizationSchema,
) {}
