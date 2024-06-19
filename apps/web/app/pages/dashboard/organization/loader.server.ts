import { json } from "@remix-run/node";
import { loaderHandler } from "~/utils/loader.server";
import { requireSignedIn } from "~/session.server";
import { TransactionApi } from "~/api/Transaction/TransactionApi.server";

export const loader = loaderHandler(async ({ request }, { fetch }) => {
  await requireSignedIn(request);
  const transactionApi = new TransactionApi(fetch);

  const { data } = await transactionApi.getAll();

  return json({
    transactions: data,
    buildelSecret: process.env.BUILDEL_SECRET as string,
  });
});
