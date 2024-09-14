import { json, redirect } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import { TransactionItemApi } from '~/api/Transaction/TransactionItemApi.server';
import { routes } from '~/routes';
import { SessionState } from '~/session.server';
import { actionHandler } from '~/utils/action.server';
import { assert } from '~/utils/assert';

export const action = actionHandler({
  delete: async ({ request, params }, { fetch }) => {
    const formData = await request.formData();
    assert(params.organizationName);
    assert(params.transactionId);
    assert(params.itemId);

    const submission = parseWithZod(formData, {
      schema: z.object({ id: z.string() }),
    });

    if (submission.status !== 'success') {
      return json(submission.reply(), { status: 400 });
    }

    const transactionItemApi = new TransactionItemApi(fetch);

    await transactionItemApi.delete(
      submission.value.id,
      params.transactionId,
      params.organizationName,
    );

    const sessionState = await SessionState.fromRequest(request);

    return redirect(
      routes.receipt.getPath(params.organizationName, params.transactionId),
      {
        headers: {
          'Set-Cookie': await sessionState
            .setToasts({ success: 'Transaction item deleted successfully' })
            .commit(),
        },
      },
    );
  },
});
