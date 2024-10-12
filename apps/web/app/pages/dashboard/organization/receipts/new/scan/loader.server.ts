import { json } from '@remix-run/node';

import { requireSignedIn } from '~/session.server';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request }) => {
  await requireSignedIn(request);

  return json({
    pageUrl: process.env.PAGE_URL ?? '',
  });
});
