import { z } from "zod";
import { getTransactionSchema } from "~/api/Transaction/transactionApi.contracts";

export const getOrganizationSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  name: z.string(),
  users: z.array(z.string()),
  transactions: z.array(getTransactionSchema),
});

export const fromGetOrganizationsResponse = z.array(getOrganizationSchema);
