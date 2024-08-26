import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const getProcessedReceipt = z.object({
  products: z.array(
    z.object({
      name: z.string(),
      price: z.union([z.number(), z.string().transform((v) => parseFloat(v))]),
      quantity: z.union([
        z.number(),
        z.string().transform((v) => parseFloat(v)),
      ]),
      category: z.string(),
      categoryName: z.string(),
    }),
  ),
  content: z.string(),
});

export class GetProcessedReceiptDto extends createZodDto(getProcessedReceipt) {}
