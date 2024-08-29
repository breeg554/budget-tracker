import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SerializeFrom } from '@remix-run/node';
import { useLoaderData, useNavigate, useNavigation } from '@remix-run/react';

import { Pagination } from '~/pagination/pagination.utils';
import { hashString } from '~/utils/stringHash';
import { buildUrlWithParams } from '~/utils/url';

interface UseInfiniteFetcherProps<T, R, P = {}> {
  loaderUrl: string;
  dataExtractor: (response: SerializeFrom<R>) => {
    data: T[];
    pagination: Pagination<P>;
  };
}
//@todo handle case when user is on different page than 1 and he refreshes the page
export const useInfiniteFetcher = <T, R>(
  args: UseInfiniteFetcherProps<T, R>,
) => {
  const { state } = useNavigation();
  const navigate = useNavigate();
  const loader = useLoaderData<R>();
  const { pagination, data: freshData } = args.dataExtractor(loader);
  const isIdle = state === 'idle';

  const [data, setData] = useState<Record<number, Record<number, T[]>>>({
    [getDataPageKey(pagination)]: {
      [pagination.page]: freshData ?? [],
    },
  });
  useEffect(() => {
    const key = getDataPageKey(pagination);
    const page = pagination.page;

    if (data[key]?.[page]) return;

    setData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [page]: freshData ?? [],
      },
    }));
  }, [pagination, data]);

  const fetchNextPage = useCallback(() => {
    if (!isIdle) return;

    const newPage = pagination.page + 1;

    const key = getDataPageKey(pagination);

    if (data?.[key]?.[newPage] !== undefined) return;

    const params = splitPagination(pagination).filters;

    const urlWithParams = buildUrlWithParams(args.loaderUrl, {
      ...params,
      page: newPage,
    });

    navigate(urlWithParams, { preventScrollReset: true });
  }, [pagination, args.loaderUrl, data]);

  const filterPages = (params: Partial<Pagination>) => {
    if (!isIdle) return;

    const urlWithParams = buildUrlWithParams(args.loaderUrl, {
      page: 1,
      limit: pagination.limit,
      ...params,
    });

    const key = getDataPageKey({ ...pagination, ...params });

    setData((prev) => ({
      ...prev,
      [key]: {},
    }));

    navigate(urlWithParams, { preventScrollReset: true });
  };

  const mergedData = useMemo(() => {
    const key = getDataPageKey(pagination);

    return Object.values(data?.[key] ?? {}).reduce(
      (acc, curr) => [...acc, ...curr],
      [] as T[],
    );
  }, [data, pagination]);

  const hasNextPage = pagination.totalPages > pagination.page;
  const splitedPagination = splitPagination(pagination);

  return {
    fetchNextPage,
    filterPages,
    hasNextPage,
    isFetchingNextPage: !isIdle,
    data: mergedData,
    filters: splitedPagination.filters,
    ...splitedPagination.meta,
  };
};

function getDataPageKey(pagination: Partial<Pagination>) {
  return hashString(
    Object.values(splitPagination(pagination).filters).join('-'),
  );
}

function splitPagination(pagination: Partial<Pagination>) {
  const { totalPages, totalItems, page, ...rest } = pagination;

  return { filters: rest, meta: { totalPages, totalItems, page } };
}
