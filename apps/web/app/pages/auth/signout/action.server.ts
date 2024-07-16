import { redirect } from '@remix-run/node';

import { routes } from '~/routes';
import { logout } from '~/session.server';
import { actionHandler } from '~/utils/action.server';

export const action = actionHandler({
  post: async ({ request }) => {
    return redirect(routes.signIn.getPath(), {
      headers: { 'Set-cookie': await logout(request) },
    });
  },
});
