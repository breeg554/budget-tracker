import { CustomDate } from '~/utils/CustomDate';

import { paginationDefaults } from './pagination.utils';

export const getPaginationFromUrl = (url: string) => {
  const searchParams = new URL(url).searchParams;

  const urlStartDate = searchParams.get('startDate');
  const urlEndDate = searchParams.get('endDate');

  let startDate = new CustomDate(new Date().toISOString())
    .startOfWeek()
    .formatISO();
  let endDate = new CustomDate(new Date().toISOString())
    .endOfWeek()
    .formatISO();

  if (urlStartDate && CustomDate.isStringValidDate(urlStartDate)) {
    startDate = new CustomDate(urlStartDate).startOfDay().formatISO();
  }

  if (urlEndDate && CustomDate.isStringValidDate(urlEndDate)) {
    endDate = new CustomDate(urlEndDate).endOfDay().formatISO();
  }

  return {
    ...paginationDefaults,
    startDate,
    endDate,
  };
};
