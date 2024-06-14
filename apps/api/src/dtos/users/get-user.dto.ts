import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { getOrganizationSchema } from '~/dtos/organization/get-organization.dto';

export const getUserSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  email: z.string(),
  organizations: z.array(getOrganizationSchema),
});

export class GetUserDto extends createZodDto(getUserSchema) {}
