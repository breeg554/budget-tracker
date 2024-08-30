import merge from 'lodash.merge';
import { LRUCache } from 'lru-cache';
import { z, ZodType } from 'zod';

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnknownAPIError,
  ValidationError,
} from '~/utils/errors';

export type ParsedResponse<T> = Response & { data: T };

type TypedFetchRequestInit = RequestInit & { cacheId?: string | null };

const cache = new LRUCache<string, Response>({
  max: 500,
});

export const typedFetch = async <T extends ZodType>(
  schema: T,
  url: string,
  args?: TypedFetchRequestInit,
): Promise<ParsedResponse<z.infer<T>>> => {
  let cachedResponse: Response | undefined = undefined;

  if (isGetRequest(args)) {
    cachedResponse = cache.get(buildCacheKey(url, args));
  }

  const headers =
    args?.body instanceof FormData
      ? {}
      : {
          'Content-Type': 'application/json',
          'If-None-Match': cachedResponse?.headers.get('etag'),
        };

  let response = await fetch(
    url,
    merge(
      {
        headers,
      },
      args ?? {},
    ),
  ).catch((e) => {
    console.error(`Failed to fetch from url: ${url} - ${e}`);
    throw new UnknownAPIError();
  });

  if (response.status === 200 && isGetRequest(args)) {
    cache.set(buildCacheKey(url, args), response.clone());
  }

  if (response.status === 304 && cachedResponse) {
    response = cachedResponse.clone();
  }

  if (!response.ok) {
    if (response.status === 422) {
      const errors = await response.json();
      throw new ValidationError(errors.fieldErrors ?? {});
    } else if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedError();
    } else if (response.status === 404) {
      throw new NotFoundError();
    } else if (response.status === 400) {
      const errors = await response.json();
      throw new BadRequestError(errors.message ?? 'Bad request');
    } else {
      console.error(`Unknown API error ${response.status} for ${url}`);
      throw new UnknownAPIError();
    }
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return Object.assign(response, { data: {} });
  }

  const jsonResponse = await response.json();
  const data = schema.parse(jsonResponse);

  return Object.assign(response, { data });
};

export type TypedFetch = typeof typedFetch;

function isGetRequest(args?: RequestInit): boolean {
  return !args?.method || args.method === 'GET' || args.method === 'get';
}

function buildCacheKey(url: string, args?: TypedFetchRequestInit): string {
  return url + (args?.cacheId ?? '');
}
