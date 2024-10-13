import { json } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';

import { processReceiptSchema } from '~/api/Receipt/receiptApi.contracts';
import { ReceiptApi } from '~/api/Receipt/ReceiptApi.server';
import { requireSignedIn } from '~/session.server';
import { actionHandler } from '~/utils/action.server';
import { assert } from '~/utils/assert';

export const action = actionHandler({
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  //@ts-ignore
  post: async ({ request, params }, { fetch: superFetch }) => {
    assert(params.organizationName, 'Organization Name is required');

    await requireSignedIn(request);

    const receiptApi = new ReceiptApi(superFetch);

    const formData = await request.formData();
    const submission = parseWithZod(formData, {
      schema: processReceiptSchema,
    });

    if (submission.status !== 'success') {
      return json(submission.reply());
    }
    const uploaded = await receiptApi.upload(params.organizationName, formData);

    return json(uploaded.data);
  },
});
