import { json, redirect } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { actionHandler } from "~/utils/action.server";
import { requireSignedIn } from "~/session.server";
import { createTransactionSchema } from "~/api/Transaction/transactionApi.contracts";
import { TransactionApi } from "~/api/Transaction/TransactionApi.server";
import { routes } from "~/routes";

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    await requireSignedIn(request);

    const formData = await request.formData();

    const submission = parseWithZod(formData, {
      schema: createTransactionSchema,
    });

    if (submission.status !== "success") {
      return json(submission.reply());
    }

    const transactionApi = new TransactionApi(fetch);

    await transactionApi.create(submission.value);

    return redirect(routes.dashboard.getPath());
  },
});
