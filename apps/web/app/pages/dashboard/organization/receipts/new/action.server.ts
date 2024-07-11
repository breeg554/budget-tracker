import { json, redirect } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { actionHandler } from "~/utils/action.server";
import { requireSignedIn } from "~/session.server";
import { createTransactionSchema } from "~/api/Transaction/transactionApi.contracts";
import { TransactionApi } from "~/api/Transaction/TransactionApi.server";
import { routes } from "~/routes";
import { assert } from "~/utils/assert";

export const action = actionHandler({
  post: async ({ request, params }, { fetch }) => {
    await requireSignedIn(request);
    assert(params.organizationName);
    const formData = await request.formData();

    const submission = parseWithZod(formData, {
      schema: createTransactionSchema,
    });
    if (submission.status !== "success") {
      return json(submission.reply());
    }

    const transactionApi = new TransactionApi(fetch);

    await transactionApi.create(params.organizationName, submission.value);

    return redirect(routes.dashboard.getPath());
  },
});
