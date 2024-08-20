import { json, redirect } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';

import { createTransactionSchema } from '~/api/Transaction/transactionApi.contracts';
import { TransactionApi } from '~/api/Transaction/TransactionApi.server';
import { routes } from '~/routes';
import { requireSignedIn, setServerToasts } from '~/session.server';
import { actionHandler } from '~/utils/action.server';
import { assert } from '~/utils/assert';

export const action = actionHandler({
  post: async ({ request, params }, { fetch }) => {
    await requireSignedIn(request);
    assert(params.organizationName);
    const formData = await request.formData();

    const submission = parseWithZod(formData, {
      schema: createTransactionSchema,
    });

    if (submission.status !== 'success') {
      return json(submission.reply());
    }

    const transactionApi = new TransactionApi(fetch);

    await transactionApi.create(params.organizationName, submission.value);

    return redirect(routes.organization.getPath(params.organizationName), {
      headers: {
        'Set-Cookie': await setServerToasts(request, {
          success: {
            title: 'Transaction created',
            description: `You've successfully created the transaction`,
          },
        }),
      },
    });
  },
});
