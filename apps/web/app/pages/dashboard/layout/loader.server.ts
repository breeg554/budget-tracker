import { redirect } from "@remix-run/node";
import { loaderHandler } from "~/utils/loader.server";
import { requireSignedIn } from "~/session.server";
import { OrganizationApi } from "~/api/Organization/OrganizationApi.server";
import { routes } from "~/routes";

export const loader = loaderHandler(async ({ request }, { fetch }) => {
  await requireSignedIn(request);

  const organizationApi = new OrganizationApi(fetch);

  const { data } = await organizationApi.getAll();

  if (data.length <= 0) return redirect(routes.newOrganization.getPath());

  return redirect(routes.organization.getPath(data[0].name));
});
