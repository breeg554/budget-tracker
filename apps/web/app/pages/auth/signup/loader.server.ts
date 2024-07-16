import { json } from '@remix-run/node';

import { requireNotSignedIn } from '~/session.server';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request }) => {
  await requireNotSignedIn(request);
  return json({});
});
