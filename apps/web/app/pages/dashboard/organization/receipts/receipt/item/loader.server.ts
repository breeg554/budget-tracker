import { json } from '@remix-run/node';

import { TransactionItemApi } from '~/api/Transaction/TransactionItemApi.server';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);

  assert(params.organizationName);
  assert(params.transactionId);
  assert(params.itemId);

  const transactionItemApi = new TransactionItemApi(fetch);
  const transactionItem = await transactionItemApi.getOne(
    params.itemId,
    params.transactionId,
    params.organizationName,
  );

  return json({
    organizationName: params.organizationName,
    transactionItem: transactionItem.data,
    transactionId: params.transactionId,
  });
});
