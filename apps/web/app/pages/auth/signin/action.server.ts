import { json, redirect } from '@remix-run/node';
import { parseWithZod } from '@conform-to/zod';

import { AuthApi } from '~/api/Auth/AuthApi.server';
import { UserApi } from '~/api/User/UserApi.server';
import { routes } from '~/routes';
import { SessionState } from '~/session.server';
import { actionHandler } from '~/utils/action.server';

import { schema } from './schema';

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    const formData = await request.formData();

    const submission = parseWithZod(formData, { schema });

    if (submission.status !== 'success') {
      return json(submission.reply(), { status: 400 });
    }

    const authApi = new AuthApi(fetch);
    const response = await authApi.signIn(submission.value);

    const sessionCookie = response.headers.get('Set-Cookie')!;

    const userApi = new UserApi(fetch);
    const { data: user } = await userApi.meWithSessionCookie(sessionCookie);

    const session = await SessionState.fromRequest(request);

    return redirect(routes.dashboard.getPath(), {
      headers: {
        'Set-cookie': await session
          .setAuthCookie(sessionCookie)
          .setCurrentUser(user)
          .commit(),
      },
    });
  },
});
