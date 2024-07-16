import { json } from '@remix-run/node';

import { requireSignedIn } from '~/session.server';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request }, { fetch }) => {
  await requireSignedIn(request);

  return json({});
});
