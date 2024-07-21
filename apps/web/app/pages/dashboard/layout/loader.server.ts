import { redirect } from '@remix-run/node';

import { OrganizationApi } from '~/api/Organization/OrganizationApi.server';
import { routes } from '~/routes';
import { getLastOrganization, requireSignedIn } from '~/session.server';
import { loaderHandler } from '~/utils/loader.server';

export const loader = loaderHandler(async ({ request }, { fetch }) => {
  await requireSignedIn(request);

  const organizationApi = new OrganizationApi(fetch);

  const { data } = await organizationApi.getAll();

  if (data.length <= 0) return redirect(routes.newOrganization.getPath());

  const lastOrganization = await getLastOrganization(request);
  if (lastOrganization) {
    return redirect(routes.organization.getPath(lastOrganization));
  }

  return redirect(routes.organization.getPath(data[0].name));
});
