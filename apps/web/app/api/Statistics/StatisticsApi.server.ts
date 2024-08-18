import { fromGetStatisticsByCategoryResponse } from '~/api/Statistics/statisticsApi.contracts';
import { typedFetch, TypedFetch } from '~/utils/fetch';
import { buildUrlWithParams } from '~/utils/url';

export class StatisticsApi {
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  getStatisticsByCategories(
    organizationName: string,
    query?: { startDate: string; endDate: string },
  ) {
    const url = buildUrlWithParams(
      `/organizations/${organizationName}/statistics/categories`,
      query,
    );
    return this.client(fromGetStatisticsByCategoryResponse, url);
  }
}
