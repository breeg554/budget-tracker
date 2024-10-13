import { z } from 'zod';

import {
  fromReceiptProcessResponse,
  processReceiptSchema,
  receiptProduct,
} from '~/api/Receipt/receiptApi.contracts';

export type ProcessReceiptSchema = z.TypeOf<typeof processReceiptSchema>;

export type ReceiptProduct = z.TypeOf<typeof receiptProduct>;

export type ReceiptProcessDto = z.TypeOf<typeof fromReceiptProcessResponse>;
