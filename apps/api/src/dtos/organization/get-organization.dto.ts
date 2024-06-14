import { z } from 'nestjs-zod/z';
import { createZodDto } from 'nestjs-zod';
import { getUserSchema } from '~/dtos/users/get-user.dto';
import { getTransactionSchema } from '~/dtos/transaction/get-transaction.dto';

export const getOrganizationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  users: z.array(getUserSchema),
  transactions: z.array(getTransactionSchema),
});

export class GetOrganizationDto extends createZodDto(getOrganizationSchema) {}
