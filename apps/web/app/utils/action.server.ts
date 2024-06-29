import {
  ActionFunctionArgs,
  TypedResponse,
  json,
  redirect,
} from "@remix-run/node";
import { serverTypedFetch } from "~/utils/fetch.server";
import { TypedFetch } from "~/utils/fetch";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnknownAPIError,
  ValidationError,
} from "~/utils/errors";
import { routes } from "~/routes";
import { logout } from "~/session.server";
import { SubmissionResult } from "@conform-to/react";

type ActionHandler<T> = (
  args: ActionFunctionArgs,
  helpers: { fetch: TypedFetch },
) => Promise<T>;

export const actionHandler =
  <T>(handlers: {
    post?: ActionHandler<TypedResponse<T>>;
    delete?: ActionHandler<TypedResponse<T>>;
    patch?: ActionHandler<TypedResponse<T>>;
    put?: ActionHandler<TypedResponse<T>>;
    get?: ActionHandler<TypedResponse<T>>;
  }) =>
  async (actionArgs: ActionFunctionArgs) => {
    const notFound = () => json(null, { status: 404 });
    try {
      switch (actionArgs.request.method) {
        case "POST":
          return handlers.post
            ? await handlers.post(actionArgs, {
                fetch: await serverTypedFetch(actionArgs.request),
              })
            : notFound();
        case "DELETE":
          return handlers.delete
            ? await handlers.delete(actionArgs, {
                fetch: await serverTypedFetch(actionArgs.request),
              })
            : notFound();
        case "PATCH":
          return handlers.patch
            ? await handlers.patch(actionArgs, {
                fetch: await serverTypedFetch(actionArgs.request),
              })
            : notFound();
        case "PUT":
          return handlers.put
            ? await handlers.put(actionArgs, {
                fetch: await serverTypedFetch(actionArgs.request),
              })
            : notFound();
        case "GET":
          return handlers.get
            ? await handlers.get(actionArgs, {
                fetch: await serverTypedFetch(actionArgs.request),
              })
            : notFound();
      }
    } catch (e) {
      if (e instanceof ValidationError) {
        return json(toSubmissionError(e.fieldErrors));
      } else if (e instanceof UnauthorizedError) {
        throw redirect(routes.signIn.getPath(), {
          headers: {
            "Set-cookie": await logout(actionArgs.request),
          },
        });
      } else if (e instanceof NotFoundError) {
        throw notFound();
      } else if (e instanceof UnknownAPIError) {
        return json(toSubmissionError({ global: ["Unknown API error"] }), {
          status: 500,
        });
      } else if (e instanceof BadRequestError) {
        return json(toSubmissionError({ global: [e.message] }), {
          status: 400,
        });
      }
      console.error(e);
      throw e;
    }

    return notFound();
  };

export function toSubmissionError(
  errors: Record<string, string[]>,
): SubmissionResult {
  return {
    error: errors,
    status: "error",
    initialValue: {},
  };
}
