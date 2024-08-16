import { json } from '@remix-run/node';

import { TransactionApi } from '~/api/Transaction/TransactionApi.server';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { CustomDate } from '~/utils/CustomDate';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);
  assert(params.organizationName);

  const transactionApi = new TransactionApi(fetch);
  const currentDate = new Date();

  const startDate = new CustomDate(currentDate).startOfWeek().formatISO();
  const endDate = new CustomDate(currentDate).endOfWeek().formatISO();

  const weeklyTransactionsPromise = transactionApi.getAll(
    params.organizationName,
    {
      startDate: startDate,
      endDate: endDate,
    },
  );

  const latestTransactionsPromise = transactionApi.getAll(
    params.organizationName,
    {
      limit: 5,
    },
  );

  const [weeklyTransactions, latestTransactions] = await Promise.all([
    weeklyTransactionsPromise,
    latestTransactionsPromise,
  ]);

  return json({
    weeklyTransactions: weeklyTransactions.data.data,
    latestTransactions: latestTransactions.data.data,
    organizationName: params.organizationName,
    startDate,
    endDate,
  });
});
