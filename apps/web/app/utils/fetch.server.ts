import merge from 'lodash.merge';

import { SessionState } from '~/session.server';
import { typedFetch, TypedFetch } from '~/utils/fetch';

export const serverTypedFetch =
  async (request: Request): Promise<TypedFetch> =>
  async (schema, url, options) => {
    const sessionState = await SessionState.fromRequest(request);

    return typedFetch(
      schema,
      `${process.env.PAGE_URL}/api` + url,
      merge(
        {
          headers: {
            Cookie: sessionState.tokens,
          },
        },
        { ...options, cacheId: sessionState.currentUser?.id },
      ),
    );
  };
