import { json } from '@remix-run/node';

import { StatisticsApi } from '~/api/Statistics/StatisticsApi.server';
import { getPaginationFromUrl } from '~/pagination/getPaginationFromUrl';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { CustomDate } from '~/utils/CustomDate';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);
  assert(params.organizationName);

  const statisticsApi = new StatisticsApi(fetch);

  const { startDate, endDate } = getPaginationFromUrl(request.url);

  const dateRange =
    startDate && endDate
      ? { startDate, endDate }
      : CustomDate.getWeekRange(new Date());

  const byCategories = await statisticsApi.getStatisticsByCategories(
    params.organizationName,
    {
      ...dateRange,
    },
  );

  return json({
    statsByCategories: byCategories.data,
    ...dateRange,
  });
});
