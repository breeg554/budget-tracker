import { isNotNil } from '~/utils/guards';

export type UrlQueryParams = Record<string, string | number | undefined>;

export function buildUrlWithParams(
  baseUrl: string,
  params?: Record<string, string | number | undefined | string[]>,
) {
  let url = baseUrl;

  if (!params) return url;

  const queryString = Object.entries(params)
    .filter(([, value]) => isNotNil(value))
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
    )
    .join('&');

  if (queryString.length > 0) {
    url += (baseUrl.includes('?') ? '&' : '?') + queryString;
  }

  return url;
}

export function getUrlArrayParam(value: string | string[] | null | undefined) {
  if (!value) return undefined;

  const arr = typeof value === 'string' ? value.split(',') : value;
  return arr.filter(Boolean);
}
