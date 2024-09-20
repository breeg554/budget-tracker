import { z } from 'zod';

export const receiptProduct = z.object({
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  category: z.string(),
  categoryName: z.string(),
});

export const fromReceiptProcessResponse = z.object({
  products: z.array(receiptProduct),
  place: z.union([z.string(), z.null()]),
  date: z.union([z.string(), z.null()]),
  content: z.string(),
});

export const processReceiptSchema = z.object({
  file: z.any(),
});

export const isFromProcessReceiptSchema = (
  obj: any,
): obj is z.infer<typeof fromReceiptProcessResponse> =>
  fromReceiptProcessResponse.safeParse(obj).success;
