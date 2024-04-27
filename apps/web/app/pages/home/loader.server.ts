import { json } from "@remix-run/node";
import { loaderHandler } from "~/utils/loader.server";
import { requireSignedIn } from "~/session.server";

export const loader = loaderHandler(async ({ request }) => {
  await requireSignedIn(request);

  return json({
    todos: [],
    buildelSecret: process.env.BUILDEL_SECRET as string,
  });
});
