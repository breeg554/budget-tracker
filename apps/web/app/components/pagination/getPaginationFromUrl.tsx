import { CustomDate } from '~/utils/CustomDate';

import { Pagination, PAGINATION_DEFAULTS } from './pagination.utils';

export const getPaginationFromUrl = (url: string): Pagination => {
  const searchParams = new URL(url).searchParams;

  const urlStartDate = searchParams.get('startDate');
  const urlEndDate = searchParams.get('endDate');

  const dateRange = CustomDate.getWeekRange(new Date());

  if (urlStartDate && CustomDate.isStringValidDate(urlStartDate)) {
    dateRange.startDate = new CustomDate(urlStartDate).formatISO();
  }
  if (urlEndDate && CustomDate.isStringValidDate(urlEndDate)) {
    dateRange.endDate = new CustomDate(urlEndDate).formatISO();
  }
  const page = searchParams.get('page') ?? PAGINATION_DEFAULTS.page;
  const limit = searchParams.get('limit') ?? PAGINATION_DEFAULTS.limit;
  const search = searchParams.get('search') ?? PAGINATION_DEFAULTS.search;

  return {
    ...PAGINATION_DEFAULTS,
    ...dateRange,
    limit: Number(limit),
    page: Number(page),
    search,
  };
};
