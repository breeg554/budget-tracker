import { json } from '@remix-run/node';
import { z } from 'zod';

import { requireSignedIn } from '~/session.server';
import { actionHandler } from '~/utils/action.server';

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    await requireSignedIn(request);

    const body = await request.json();

    const socketAuth = await fetch(z.any(), '/auth/socket', {
      method: 'post',
      body: JSON.stringify(body),
    });

    return json({
      token: socketAuth?.data?.token,
    });
  },
});
