import { json } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { actionHandler } from "~/utils/action.server";
import { requireSignedIn } from "~/session.server";
import { createTransactionSchema } from "~/api/Transaction/transactionApi.contracts";

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    await requireSignedIn(request);

    const formData = await request.formData();

    const submission = parseWithZod(formData, {
      schema: createTransactionSchema,
    });
    console.log(submission);
    if (submission.status !== "success") {
      return json(submission.reply());
    }

    return json({});
  },
});
