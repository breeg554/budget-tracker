import { json, redirect } from "@remix-run/node";
import { actionHandler } from "~/utils/action.server";
import { commitSession, getSession, requireSignedIn } from "~/session.server";
import { routes } from "~/routes";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import {
  createTransactionItemSchema,
  createTransactionSchema,
} from "~/api/Transaction/transactionApi.contracts";

export const extendedTransactionSchema = createTransactionSchema.extend({
  items: z.preprocess(
    (val) => (typeof val === "string" ? JSON.parse(val) : val),
    z.array(createTransactionItemSchema),
  ),
});

export const action = actionHandler({
  post: async ({ request }) => {
    await requireSignedIn(request);

    const formData = await request.formData();
    console.log(formData.get("items"));
    const submission = parseWithZod(formData, {
      schema: extendedTransactionSchema.partial(),
    });
    console.log(submission);
    if (submission.status !== "success") {
      return json(submission.reply());
    }
    const session = await getSession(request.headers.get("Cookie"));
    session.flash("TRANSACTION_FORM_STATE", submission.value);

    return redirect(routes.newReceipt.getPath(), {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  },
});
