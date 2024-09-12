import { json } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import { TransactionApi } from '~/api/Transaction/TransactionApi.server';
import { SessionState } from '~/session.server';
import { actionHandler } from '~/utils/action.server';
import { assert } from '~/utils/assert';

export const action = actionHandler({
  delete: async ({ request, params }, { fetch }) => {
    const formData = await request.formData();
    assert(params.organizationName);

    const submission = parseWithZod(formData, {
      schema: z.object({ id: z.string() }),
    });

    if (submission.status !== 'success') {
      return json(submission.reply(), { status: 400 });
    }

    const transactionApi = new TransactionApi(fetch);

    await transactionApi.delete(submission.value.id, params.organizationName);

    const sessionState = await SessionState.fromRequest(request);

    return json(
      {},
      {
        headers: {
          'Set-Cookie': await sessionState
            .setToasts({ success: 'Receipt deleted successfully' })
            .commit(),
        },
      },
    );
  },
});
