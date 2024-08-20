import { CustomDate } from '~/utils/CustomDate';

import { paginationDefaults } from './pagination.utils';

export const getPaginationFromUrl = (url: string) => {
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

  return {
    ...paginationDefaults,
    ...dateRange,
  };
};
