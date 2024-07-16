import { z } from 'zod';

import { CreateTransactionDto } from '~/api/Transaction/transactionApi.types';
import { typedFetch, TypedFetch } from '~/utils/fetch';

import { fromGetTransactionsResponse } from './transactionApi.contracts';

export class TransactionApi {
  private readonly baseUrl = '/transactions';
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  create(organizationName: string, data: CreateTransactionDto) {
    return this.client(
      z.any(),
      `/organizations/${organizationName}/transactions`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );
  }

  getAll(organizationName: string) {
    return this.client(
      fromGetTransactionsResponse,
      `/organizations/${organizationName}/transactions`,
      {
        method: 'get',
      },
    );
  }
}
