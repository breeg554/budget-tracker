import { json } from '@remix-run/node';

import { StatisticsApi } from '~/api/Statistics/StatisticsApi.server';
import { TransactionApi } from '~/api/Transaction/TransactionApi.server';
import { getPaginationFromUrl } from '~/pagination/getPaginationFromUrl';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);
  assert(params.organizationName);

  const transactionApi = new TransactionApi(fetch);
  const statisticsApi = new StatisticsApi(fetch);

  const { startDate, endDate } = getPaginationFromUrl(request.url);
  console.log(startDate, endDate);
  const transactionsPromise = transactionApi.getAll(params.organizationName, {
    startDate: startDate,
    endDate: endDate,
  });
  const latestTransactionsPromise = transactionApi.getAll(
    params.organizationName,
    {
      limit: 4,
    },
  );
  const byCategoriesPromise = statisticsApi.getStatisticsByCategories(
    params.organizationName,
    {
      startDate,
      endDate,
    },
  );

  const [transactions, latestTransactions, byCategories] = await Promise.all([
    transactionsPromise,
    latestTransactionsPromise,
    byCategoriesPromise,
  ]);

  return json({
    transactions: transactions.data.data,
    latestTransactions: latestTransactions.data.data,
    statsByCategories: byCategories.data
      .slice()
      .sort((a, b) => b.total - a.total),
    organizationName: params.organizationName,
    startDate,
    endDate,
  });
});
