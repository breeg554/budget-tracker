import merge from 'lodash.merge';

import { getSession } from '~/session.server';
import { typedFetch, TypedFetch } from '~/utils/fetch';

export const serverTypedFetch =
  async (request: Request): Promise<TypedFetch> =>
  async (schema, url, options) => {
    const session = await getSession(request.headers.get('Cookie'));

    return typedFetch(
      schema,
      `${process.env.PAGE_URL}/api` + url,
      merge(
        {
          headers: {
            Cookie: session.get('tokens'),
          },
        },
        options ?? {},
      ),
    );
  };
