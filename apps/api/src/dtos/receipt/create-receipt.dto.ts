import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createReceiptSchema = z.object({
  image: z.string(),
});

export class CreateReceiptDto extends createZodDto(createReceiptSchema) {}
