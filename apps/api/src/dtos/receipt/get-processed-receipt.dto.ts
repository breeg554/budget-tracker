import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const getProcessedReceipt = z.object({
  products: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      quantity: z.number(),
      category: z.string(),
      categoryName: z.string(),
    }),
  ),
  content: z.string(),
});

export class GetProcessedReceiptDto extends createZodDto(getProcessedReceipt) {}
