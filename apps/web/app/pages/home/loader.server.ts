import { json } from "@remix-run/node";
import { loaderHandler } from "~/utils/loader.server";
import { requireSignedIn } from "~/session.server";
import { SampleApi } from "~/api/Sample/SampleApi.server";

export const loader = loaderHandler(async ({ request }, { fetch }) => {
  await requireSignedIn(request);
  const sampleApi = new SampleApi(fetch);

  const { data } = await sampleApi.getSampleData();

  return json({
    users: data,
    buildelSecret: process.env.BUILDEL_SECRET as string,
  });
});
