import { z } from 'zod';

import { processReceiptSchema } from '~/api/Receipt/receiptApi.contracts';

export type ProcessReceiptSchema = z.TypeOf<typeof processReceiptSchema>;
