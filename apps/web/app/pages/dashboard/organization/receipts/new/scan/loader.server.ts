import { json } from '@remix-run/node';

import { requireSignedIn } from '~/session.server';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request }) => {
  await requireSignedIn(request);

  return json({
    organizationId: process.env.BUILDEL_ORGANIZATION_ID as unknown as number,
    pipelineId: process.env.BUILDEL_PIPELINE_ID as unknown as number,
  });
});
