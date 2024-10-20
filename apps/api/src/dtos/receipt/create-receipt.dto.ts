import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const createReceiptDto = z.object({
  fileUrl: z.string(),
  fileKey: z.string(),
  originalName: z.string(),
});

export class CreateReceiptDto extends createZodDto(createReceiptDto) {}
