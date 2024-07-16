import { json, LoaderFunctionArgs, redirect } from '@remix-run/node';

import { routes } from '~/routes';
import { logout } from '~/session.server';
import {
  NotFoundError,
  UnauthorizedError,
  UnknownAPIError,
} from '~/utils/errors';
import { TypedFetch } from '~/utils/fetch';
import { serverTypedFetch } from '~/utils/fetch.server';

export const loaderHandler =
  <T>(fn: (args: LoaderFunctionArgs, helpers: { fetch: TypedFetch }) => T) =>
  async (args: LoaderFunctionArgs) => {
    try {
      return await fn(args, { fetch: await serverTypedFetch(args.request) });
    } catch (e) {
      if (e instanceof UnknownAPIError) {
        throw json(
          { error: 'Unknown API error' },
          {
            status: 500,
          },
        );
      } else if (e instanceof NotFoundError) {
        throw new Response(null, {
          status: 404,
          statusText: 'Not Found',
        });
      } else if (e instanceof UnauthorizedError) {
        throw redirect(routes.signIn.getPath(), {
          headers: {
            'Set-cookie': await logout(args.request),
          },
        });
      }

      console.error(e);

      throw e;
    }
  };
