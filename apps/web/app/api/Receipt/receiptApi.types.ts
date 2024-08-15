import { z } from 'zod';

import {
  processReceiptSchema,
  receiptProduct,
} from '~/api/Receipt/receiptApi.contracts';

export type ProcessReceiptSchema = z.TypeOf<typeof processReceiptSchema>;

export type ReceiptProduct = z.TypeOf<typeof receiptProduct>;
