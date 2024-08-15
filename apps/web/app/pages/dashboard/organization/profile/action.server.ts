import { json, redirect } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';

import { createSecretSchema } from '~/api/Organization/organizationApi.contracts';
import { OrganizationApi } from '~/api/Organization/OrganizationApi.server';
import { routes } from '~/routes';
import { actionHandler } from '~/utils/action.server';
import { assert } from '~/utils/assert';

export const action = actionHandler({
  post: async ({ request, params }, { fetch }) => {
    const formData = await request.formData();
    assert(params.organizationName);

    const submission = parseWithZod(formData, {
      schema: createSecretSchema,
    });
    console.log(submission);
    if (submission.status !== 'success') {
      return json(submission.reply(), { status: 400 });
    }

    const organizationApi = new OrganizationApi(fetch);

    await organizationApi.createSecret(
      params.organizationName,
      submission.value,
    );

    return json({});
  },
});
