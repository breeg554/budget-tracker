import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { z } from 'nestjs-zod/z';
import { getOrganizationSchema } from '~/dtos/organization/get-organization.dto';
import { createZodDto } from 'nestjs-zod';

export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export class AuthUser extends createZodDto(authUserSchema) {}
