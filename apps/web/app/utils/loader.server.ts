import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { serverTypedFetch } from "~/utils/fetch.server";
import { TypedFetch } from "~/utils/fetch";
import {
  NotFoundError,
  UnauthorizedError,
  UnknownAPIError,
} from "~/utils/errors";
import { routes } from "~/routes";

export const loaderHandler =
  <T>(fn: (args: LoaderFunctionArgs, helpers: { fetch: TypedFetch }) => T) =>
  async (args: LoaderFunctionArgs) => {
    try {
      return fn(args, { fetch: await serverTypedFetch(args.request) });
    } catch (e) {
      if (e instanceof UnknownAPIError) {
        throw json(
          { error: "Unknown API error" },
          {
            status: 500,
          }
        );
      } else if (e instanceof NotFoundError) {
        throw new Response(null, {
          status: 404,
          statusText: "Not Found",
        });
      } else if (e instanceof UnauthorizedError) {
        //@todo redirect to signin ?
        throw redirect(routes.signIn.getPath());
      }

      console.error(e);

      throw e;
    }
  };
