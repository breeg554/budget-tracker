import { z } from 'zod';

import { createPaginatedSchema } from '~/api/api.types';
import { CreateTransactionDto } from '~/api/Transaction/transactionApi.types';
import { PAGINATION_DEFAULTS } from '~/pagination/pagination.utils';
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
    const params: Record<string, any> = {
      limit: query?.limit ?? PAGINATION_DEFAULTS.limit,
      page: query?.page ?? PAGINATION_DEFAULTS.page,
    };

    if (query?.startDate && query?.endDate) {
      params['filter.date'] = `$btw:${query.startDate},${query.endDate}`;
    }
    if (query?.category) {
      params['filter.items.category.id'] = `$in:${query.category}`;
    }
    if (query?.author) {
      params['filter.author.id'] = `$in:${query.author}`;
    }
    if (query?.search) {
      params['search'] = query.search;
    }

    return this.client(
      createPaginatedSchema(fromGetTransactionsResponse),
      buildUrlWithParams(
        `/organizations/${organizationName}/transactions`,
        params,
      ),
      {
        method: 'get',
      },
    );
  }
}
