import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const getProcessedReceipt = z.object({
  content: z.string(),
});

export const getProcessedReceiptProducts = z.object({
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
});

export class GetProcessedReceiptDto extends createZodDto(getProcessedReceipt) {}
