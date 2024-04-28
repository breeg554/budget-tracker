import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';
import { UnprocessableEntityException } from '@nestjs/common';

export const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new UnprocessableEntityException(error.flatten());
  },
});
