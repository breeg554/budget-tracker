import { json } from '@remix-run/node';
import { Outlet } from '@remix-run/react';

import { OrganizationApi } from '~/api/Organization/OrganizationApi.server';
import {
  DashboardNav,
  NavFloatingWrapper,
} from '~/dashboard/layout/components/DashboardNav';
import { requireSignedIn, setLastOrganization } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);
  assert(params.organizationName);

  const organizationApi = new OrganizationApi(fetch);

  const organization = await organizationApi.getByName(params.organizationName);

  if (!organization) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await setLastOrganization(
          request,
          organization.data.name,
        ),
      },
    },
  );
});

export default function OrganizationPage() {
  return (
    <>
      <Outlet />

      <NavFloatingWrapper>
        <DashboardNav />
      </NavFloatingWrapper>
    </>
  );
}
