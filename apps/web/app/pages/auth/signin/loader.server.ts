import { json } from "@remix-run/node";
import { loaderHandler } from "~/utils/loader.server";
import { requireNotSignedIn } from "~/session.server";

export const loader = loaderHandler(async ({ request }) => {
  await requireNotSignedIn(request);
  return json({});
});
