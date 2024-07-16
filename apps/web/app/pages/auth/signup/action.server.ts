import { json, redirect } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';

import { signUpSchema } from '~/api/Auth/authApi.contracts';
import { AuthApi } from '~/api/Auth/AuthApi.server';
import { routes } from '~/routes';
import { setAuthSession } from '~/session.server';
import { actionHandler } from '~/utils/action.server';

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    const formData = await request.formData();

    const submission = parseWithZod(formData, { schema: signUpSchema });

    if (submission.status !== 'success') {
      return json(submission.reply());
    }

    const authApi = new AuthApi(fetch);

    const response = await authApi.signUp(submission.value);

    return redirect(routes.signIn.getPath(), {
      headers: { 'Set-cookie': await setAuthSession(request, response) },
    });
  },
});
