import merge from "lodash.merge";
import { typedFetch, TypedFetch } from "~/utils/fetch";

export const serverTypedFetch =
  async (request: Request): Promise<TypedFetch> =>
  async (schema, url, options) => {
    return typedFetch(
      schema,
      `${process.env.PAGE_URL}/api` + url,
      merge({}, options ?? {})
    );
  };
