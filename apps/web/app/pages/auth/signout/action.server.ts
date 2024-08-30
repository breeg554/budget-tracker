import { redirect } from '@remix-run/node';

import { routes } from '~/routes';
import { SessionState } from '~/session.server';
import { actionHandler } from '~/utils/action.server';

export const action = actionHandler({
  post: async ({ request }) => {
    const sessionState = await SessionState.fromRequest(request);

    return redirect(routes.signIn.getPath(), {
      headers: { 'Set-cookie': await sessionState.logout() },
    });
  },
});
