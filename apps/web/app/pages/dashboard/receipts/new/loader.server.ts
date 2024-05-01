import { json } from "@remix-run/node";
import { loaderHandler } from "~/utils/loader.server";
import { requireSignedIn } from "~/session.server";
import { TransactionItemCategoryApi } from "~/api/Transaction/TransactionItemCategoryApi.server";

export const loader = loaderHandler(async ({ request }, { fetch }) => {
  await requireSignedIn(request);

  const transactionApi = new TransactionItemCategoryApi(fetch);

  const { data } = await transactionApi.getTransactionItemCategories();

  return json({ itemCategories: data });
});
