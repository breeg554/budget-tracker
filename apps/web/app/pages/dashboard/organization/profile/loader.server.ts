import { json } from '@remix-run/node';

import { OrganizationApi } from '~/api/Organization/OrganizationApi.server';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);

  assert(params.organizationName);

  const organizationApi = new OrganizationApi(fetch);

  const organizationPromise = organizationApi.getByName(
    params.organizationName,
  );
  const organizationsPromise = organizationApi.getAll();

  const [organization, organizations] = await Promise.all([
    organizationPromise,
    organizationsPromise,
  ]);

  if (!organization) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return json({
    organization: organization.data,
    organizations: organizations.data,
  });
});
