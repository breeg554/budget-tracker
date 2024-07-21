import { z } from 'zod';

import { createPaginatedSchema } from '~/api/api.types';
import { CreateTransactionDto } from '~/api/Transaction/transactionApi.types';
import { typedFetch, TypedFetch } from '~/utils/fetch';
import { buildUrlWithParams, UrlQueryParams } from '~/utils/url';

import { fromGetTransactionsResponse } from './transactionApi.contracts';

export class TransactionApi {
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

  async getAll(organizationName: string, query?: UrlQueryParams) {
    return this.client(
      createPaginatedSchema(fromGetTransactionsResponse),
      buildUrlWithParams(
        `/organizations/${organizationName}/transactions`,
        query,
      ),
      {
        method: 'get',
      },
    );
  }
}
