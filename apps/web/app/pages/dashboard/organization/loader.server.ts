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

  let startDate = new CustomDate(currentDate).startOfWeek().formatISO();
  let endDate = new CustomDate(currentDate).endOfWeek().formatISO();

  const searchParams = new URL(request.url).searchParams;

  const sDate = searchParams.get('startDate');
  const eDate = searchParams.get('endDate');

  if (sDate && eDate) {
    startDate = new CustomDate(sDate).startOfDay().formatISO();
    endDate = new CustomDate(eDate).endOfDay().formatISO();
  }

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

  const [transactions, latestTransactions] = await Promise.all([
    transactionsPromise,
    latestTransactionsPromise,
  ]);

  return json({
    transactions: transactions.data.data,
    latestTransactions: latestTransactions.data.data,
    organizationName: params.organizationName,
    startDate,
    endDate,
  });
});
