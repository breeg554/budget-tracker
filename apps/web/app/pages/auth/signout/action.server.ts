import { redirect } from "@remix-run/node";
import { actionHandler } from "~/utils/action.server";
import { logout } from "~/session.server";
import { routes } from "~/routes";

export const action = actionHandler({
  post: async ({ request }) => {
    return redirect(routes.signIn.getPath(), {
      headers: await logout(request),
    });
  },
});
