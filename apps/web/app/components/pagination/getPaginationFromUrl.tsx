import { CustomDate } from '~/utils/CustomDate';

import { Pagination, PAGINATION_DEFAULTS } from './pagination.utils';

export const getPaginationFromUrl = (url: string): Pagination => {
  const searchParams = new URL(url).searchParams;

  const urlStartDate = searchParams.get('startDate');
  const urlEndDate = searchParams.get('endDate');

  let startDate: string | undefined;
  let endDate: string | undefined;

  if (urlStartDate && CustomDate.isStringValidDate(urlStartDate)) {
    startDate = new CustomDate(urlStartDate).formatISO();
  }
  if (urlEndDate && CustomDate.isStringValidDate(urlEndDate)) {
    endDate = new CustomDate(urlEndDate).formatISO();
  }
  const page = searchParams.get('page') ?? PAGINATION_DEFAULTS.page;
  const limit = searchParams.get('limit') ?? PAGINATION_DEFAULTS.limit;
  const search = searchParams.get('search') ?? PAGINATION_DEFAULTS.search;

  return {
    ...PAGINATION_DEFAULTS,
    startDate,
    endDate,
    limit: Number(limit),
    page: Number(page),
    search: search?.trim(),
  };
};
