import { json } from "@remix-run/node";
import { loaderHandler } from "~/utils/loader.server";
import { commitSession, getSession, requireSignedIn } from "~/session.server";
import { TransactionItemCategoryApi } from "~/api/Transaction/TransactionItemCategoryApi.server";
import { createTransactionSchema } from "~/api/Transaction/transactionApi.contracts";

export const loader = loaderHandler(async ({ request }, { fetch }) => {
  await requireSignedIn(request);

  const transactionApi = new TransactionItemCategoryApi(fetch);

  const { data } = await transactionApi.getTransactionItemCategories();

  const session = await getSession(request.headers.get("Cookie"));
  const recipe = session.get("TRANSACTION_FORM_STATE") || null;

  const validated = createTransactionSchema.partial().safeParse(recipe);

  return json(
    {
      itemCategories: data,
      recipe: validated.success ? validated.data : undefined,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    },
  );
});
