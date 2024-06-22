import { json } from "@remix-run/node";
import { loaderHandler } from "~/utils/loader.server";
import { requireSignedIn } from "~/session.server";
import { assert } from "~/utils/assert";
import { OrganizationApi } from "~/api/Organization/OrganizationApi.server";
import { DashboardNav } from "~/dashboard/layout/components/DashboardNav";
import { Outlet } from "@remix-run/react";

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);
  assert(params.organizationName);

  const organizationApi = new OrganizationApi(fetch);

  const organization = await organizationApi.getByName(params.organizationName);

  if (!organization) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json({});
});

export default function OrganizationPage() {
  return (
    <>
      <Outlet />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-150">
        <DashboardNav />
      </div>
    </>
  );
}
