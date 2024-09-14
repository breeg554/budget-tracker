import { z } from 'zod';

import { typedFetch, TypedFetch } from '~/utils/fetch';

import { getTransactionItemSchema } from './transactionApi.contracts';

export class TransactionItemApi {
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  delete(itemId: string, transactionId: string, organizationName: string) {
    return this.client(
      z.any(),
      `/organizations/${organizationName}/transactions/${transactionId}/items/${itemId}`,
      {
        method: 'DELETE',
      },
    );
  }

  getOne(itemId: string, transactionId: string, organizationName: string) {
    return this.client(
      getTransactionItemSchema,
      `/organizations/${organizationName}/transactions/${transactionId}/items/${itemId}`,
    );
  }
}
