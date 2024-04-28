import {
  ActionFunctionArgs,
  TypedResponse,
  json,
  redirect,
} from "@remix-run/node";
import { serverTypedFetch } from "~/utils/fetch.server";
import { TypedFetch } from "~/utils/fetch";
import {
  NotFoundError,
  UnauthorizedError,
  UnknownAPIError,
  ValidationError,
} from "~/utils/errors";
import { routes } from "~/routes";
import { logout } from "~/session.server";

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
        //@todo handle form validation
        throw new ValidationError();
      } else if (e instanceof UnauthorizedError) {
        //@todo redirect to signin ?
        throw redirect(routes.signIn.getPath(), {
          headers: {
            "Set-cookie": await logout(actionArgs.request),
          },
        });
      } else if (e instanceof NotFoundError) {
        throw notFound();
      } else if (e instanceof UnknownAPIError) {
        return json(
          { error: "Unknown API error" },
          {
            status: 500,
          },
        );
      }
      console.error(e);
      throw e;
    }

    return notFound();
  };
