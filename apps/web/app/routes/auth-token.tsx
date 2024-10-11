import { json } from '@remix-run/node';
import { z } from 'zod';

import { requireSignedIn } from '~/session.server';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request }, { fetch }) => {
  await requireSignedIn(request);

  const socketAuth = await fetch(z.any(), '/auth/socket-token');

  return json({
    token: socketAuth?.data?.token,
    pageUrl: process.env.PAGE_URL as string,
  });
});
