import { json } from '@remix-run/node';

import { TransactionApi } from '~/api/Transaction/TransactionApi.server';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);

  assert(params.organizationName);
  assert(params.transactionId);

  const transactionApi = new TransactionApi(fetch);

  const { data: transaction } = await transactionApi.getOne(
    params.transactionId,
    params.organizationName,
  );

  return json({
    organizationName: params.organizationName,
    transactionId: params.transactionId,
    transaction,
  });
});
