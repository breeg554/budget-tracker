import { json, redirect } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';
import { z } from 'zod';

import {
  createTransactionItemSchema,
  createTransactionSchema,
} from '~/api/Transaction/transactionApi.contracts';
import { routes } from '~/routes';
import { commitSession, getSession, requireSignedIn } from '~/session.server';
import { actionHandler } from '~/utils/action.server';
import { assert } from '~/utils/assert';

export const extendedTransactionSchema = createTransactionSchema.extend({
  items: z.preprocess(
    (val) => (typeof val === 'string' ? JSON.parse(val) : val),
    z.array(createTransactionItemSchema),
  ),
});

export const action = actionHandler({
  post: async ({ request, params }) => {
    assert(params.organizationName, 'Organization Name is required');

    await requireSignedIn(request);

    const formData = await request.formData();

    const submission = parseWithZod(formData, {
      schema: extendedTransactionSchema.partial(),
    });

    if (submission.status !== 'success') {
      return json(submission.reply());
    }
    const session = await getSession(request.headers.get('Cookie'));
    session.flash('TRANSACTION_FORM_STATE', submission.value);

    return redirect(routes.newReceipt.getPath(params.organizationName), {
      headers: { 'Set-Cookie': await commitSession(session) },
    });
  },
});
