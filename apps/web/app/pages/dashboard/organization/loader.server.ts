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

  const { data } = await transactionApi.getAll(params.organizationName, {
    startDate: startDate,
    endDate: endDate,
  });

  return json({
    transactions: data.data,
    buildelSecret: process.env.BUILDEL_SECRET as string,
    organizationName: params.organizationName,
    startDate,
    endDate,
  });
});
