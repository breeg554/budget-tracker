import { CustomDate } from '~/utils/CustomDate';

import { paginationDefaults } from './pagination.utils';

export const getPaginationFromUrl = (url: string) => {
  const searchParams = new URL(url).searchParams;

  const urlStartDate = searchParams.get('startDate');
  const urlEndDate = searchParams.get('endDate');

  let startDate = new CustomDate(new Date().toISOString())
    .startOfWeek()
    .formatISO();

  let endDate = new CustomDate(startDate).endOfWeek().formatISO();

  if (urlStartDate && CustomDate.isStringValidDate(urlStartDate)) {
    startDate = new CustomDate(urlStartDate).formatISO();
  }

  if (urlEndDate && CustomDate.isStringValidDate(urlEndDate)) {
    endDate = new CustomDate(urlEndDate).formatISO();
  }

  return {
    ...paginationDefaults,
    startDate,
    endDate,
  };
};
