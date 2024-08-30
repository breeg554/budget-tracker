import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const getOrganizationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
});

export class GetOrganizationDto extends createZodDto(getOrganizationSchema) {}
