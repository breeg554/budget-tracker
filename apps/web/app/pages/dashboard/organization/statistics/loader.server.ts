import { json } from '@remix-run/node';

import { StatisticsApi } from '~/api/Statistics/StatisticsApi.server';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { CustomDate } from '~/utils/CustomDate';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);
  assert(params.organizationName);

  const statisticsApi = new StatisticsApi(fetch);

  const byCategories = await statisticsApi.getStatisticsByCategories(
    params.organizationName,
    {
      startDate: new CustomDate(new Date()).startOfMonth().formatISO(),
      endDate: new CustomDate(new Date()).endOfMonth().formatISO(),
    },
  );

  return json({
    statsByCategories: byCategories.data,
  });
});
