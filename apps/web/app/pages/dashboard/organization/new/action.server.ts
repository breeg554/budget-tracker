import { json, redirect } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';

import { createOrganizationSchema } from '~/api/Organization/organizationApi.contracts';
import { OrganizationApi } from '~/api/Organization/OrganizationApi.server';
import { routes } from '~/routes';
import { SessionState } from '~/session.server';
import { actionHandler } from '~/utils/action.server';

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    const formData = await request.formData();

    const submission = parseWithZod(formData, {
      schema: createOrganizationSchema,
    });
    if (submission.status !== 'success') {
      return json(submission.reply(), { status: 400 });
    }

    const organizationApi = new OrganizationApi(fetch);

    const { data } = await organizationApi.create(submission.value);

    const sessionData = await SessionState.fromRequest(request);
    sessionData
      .setOrganizationName(data.name)
      .setToasts({ success: 'Organization created' });

    return redirect(routes.organization.getPath(data.name), {
      headers: {
        'Set-Cookie': await sessionData.commit(),
      },
    });
  },
});
