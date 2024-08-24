import { json } from '@remix-run/node';

import { TransactionApi } from '~/api/Transaction/TransactionApi.server';
import { getPaginationFromUrl } from '~/pagination/getPaginationFromUrl';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);

  assert(params.organizationName);

  const { page } = getPaginationFromUrl(request.url);

  const transactionApi = new TransactionApi(fetch);
  const { data: transactions } = await transactionApi.getAll(
    params.organizationName,
    { page, limit: 10 },
  );

  return json({
    organizationName: params.organizationName,
    transactions: transactions.data,
    pagination: transactions.meta,
  });
});
