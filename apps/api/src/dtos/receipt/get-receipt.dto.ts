import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { getUserSchema } from '~/dtos/users/get-user.dto';
import { getOrganizationSchema } from '~/dtos/organization/get-organization.dto';

export const getReceiptSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  organization: getOrganizationSchema,
  author: getUserSchema,
  key: z.string(),
  originalName: z.string(),
});

export class GetReceiptDto extends createZodDto(getReceiptSchema) {}
