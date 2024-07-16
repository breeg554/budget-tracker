import merge from 'lodash.merge';
import { z, ZodType } from 'zod';

import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  UnknownAPIError,
  ValidationError,
} from '~/utils/errors';

const DefaultFetchArgs: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

type ParsedResponse<T> = Response & { data: T };

export const typedFetch = async <T extends ZodType>(
  schema: T,
  url: string,
  args?: RequestInit,
): Promise<ParsedResponse<z.infer<T>>> => {
  const response = await fetch(url, merge(args ?? {}, DefaultFetchArgs)).catch(
    (e) => {
      console.error(`Failed to fetch from url: ${url} - ${e}`);
      throw new UnknownAPIError();
    },
  );

  if (!response.ok) {
    if (response.status === 422) {
      const errors = await response.json();
      throw new ValidationError(errors.fieldErrors ?? {});
    } else if (response.status === 401) {
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
