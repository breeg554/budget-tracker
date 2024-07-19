import { json } from '@remix-run/node';

import { OrganizationApi } from '~/api/Organization/OrganizationApi.server';
import { createTransactionSchema } from '~/api/Transaction/transactionApi.contracts';
import { TransactionItemCategoryApi } from '~/api/Transaction/TransactionItemCategoryApi.server';
import { commitSession, getSession, requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);
  assert(params.organizationName);

  const transactionApi = new TransactionItemCategoryApi(fetch);
  const organizationApi = new OrganizationApi(fetch);

  const organization = await organizationApi.getByName(params.organizationName);

  if (!organization) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const { data } = await transactionApi.getTransactionItemCategories();

  const session = await getSession(request.headers.get('Cookie'));
  const receipt = session.get('TRANSACTION_FORM_STATE') || null;

  const validated = createTransactionSchema.partial().safeParse(receipt);

  return json(
    {
      itemCategories: data,
      receipt: validated.success ? validated.data : undefined,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
});
