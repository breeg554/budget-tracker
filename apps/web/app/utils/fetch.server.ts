import merge from "lodash.merge";
import { typedFetch, TypedFetch } from "~/utils/fetch";
import { getSession } from "~/session.server";

export const serverTypedFetch =
  async (request: Request): Promise<TypedFetch> =>
  async (schema, url, options) => {
    const session = await getSession(request.headers.get("Cookie"));

    return typedFetch(
      schema,
      `${process.env.PAGE_URL}/api` + url,
      merge(
        {
          headers: {
            Cookie: session.get("tokens"),
          },
        },
        options ?? {},
      ),
    );
  };
