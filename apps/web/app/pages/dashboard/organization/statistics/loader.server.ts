import { json } from '@remix-run/node';

import { StatisticsApi } from '~/api/Statistics/StatisticsApi.server';
import { TransactionApi } from '~/api/Transaction/TransactionApi.server';
import { getPaginationFromUrl } from '~/pagination/getPaginationFromUrl';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { CustomDate } from '~/utils/CustomDate';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);
  assert(params.organizationName);

  const statisticsApi = new StatisticsApi(fetch);
  const transactionApi = new TransactionApi(fetch);

  const { startDate, endDate } = getPaginationFromUrl(request.url);

  const dateRange =
    startDate && endDate
      ? { startDate, endDate }
      : CustomDate.getWeekRange(new Date());

  const transactionsPromise = transactionApi.getAll(params.organizationName, {
    ...dateRange,
    limit: 100,
  });

  const byCategoriesPromise = statisticsApi.getStatisticsByCategories(
    params.organizationName,
    {
      ...dateRange,
    },
  );

  const [transactions, byCategories] = await Promise.all([
    transactionsPromise,
    byCategoriesPromise,
  ]);

  return json({
    statsByCategories: byCategories.data,
    transactions: transactions.data.data,
    ...dateRange,
  });
});
