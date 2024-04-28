import { json, redirect } from "@remix-run/node";
import { parseWithZod } from "@conform-to/zod";
import { actionHandler } from "~/utils/action.server";
import { setAuthSession } from "~/session.server";
import { AuthApi } from "~/api/Auth/AuthApi.server";
import { routes } from "~/routes";
import { schema } from "./schema";

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    const formData = await request.formData();

    const submission = parseWithZod(formData, { schema });

    if (submission.status !== "success") {
      return json(submission.reply(), { status: 400 });
    }

    const authApi = new AuthApi(fetch);

    const response = await authApi.signIn(submission.value);

    return redirect(routes.homepage.getPath(), {
      headers: { "Set-cookie": await setAuthSession(request, response) },
    });
  },
});
