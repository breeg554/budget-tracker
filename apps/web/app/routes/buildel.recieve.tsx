import { actionHandler } from "~/utils/action.server";
import { json } from "@remix-run/node";

export const action = actionHandler({
  post: async ({ request }, { fetch }) => {
    const payload = await request.text();
    console.log(payload);
    return json(payload);
  },
});
