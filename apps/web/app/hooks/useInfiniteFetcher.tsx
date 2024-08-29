import { useEffect, useMemo, useState } from 'react';
import type { SerializeFrom } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { FetcherWithComponents } from '@remix-run/react';

import { Pagination } from '~/pagination/pagination.utils';
import { hashString } from '~/utils/stringHash';
import { buildUrlWithParams } from '~/utils/url';

interface UseInfiniteFetcherProps<T, R, P = {}> {
  loaderUrl: string;
  initialPagination: Pagination<P>;
  initialData?: T[];
  dataExtractor: (
    response: FetcherWithComponents<SerializeFrom<R>>,
  ) => { data?: T[]; pagination?: Pagination<P> } | undefined;
}

export const useInfiniteFetcher = <T, R>(
  args: UseInfiniteFetcherProps<T, R>,
) => {
  const fetcher = useFetcher<R>();
  const { page: initialPage, ...initialState } = args.initialPagination;

  const [data, setData] = useState<Record<number, Record<number, T[]>>>({
    [getDataPageKey(initialState)]: {
      [initialPage]: args?.initialData ?? [],
    },
  });

  const actualPagination = useMemo(() => {
    const data = args.dataExtractor(fetcher);

    return {
      ...initialState,
      ...data?.pagination,
      page: data?.pagination?.page ?? initialPage,
    };
  }, [initialState, fetcher.data]);

  const fetchNextPage = () => {
    if (fetcher.state !== 'idle') return;
    const newPage = actualPagination.page + 1;

    const key = getDataPageKey(initialState);

    if (data?.[key]?.[newPage] !== undefined) return;

    const urlWithParams = buildUrlWithParams(args.loaderUrl, {
      page: newPage,
      limit: actualPagination.limit,
      search: actualPagination.search,
    });

    fetcher.load(urlWithParams);
  };

  const filterPages = (params: Partial<Pagination>) => {
    if (fetcher.state !== 'idle') return;

    const urlWithParams = buildUrlWithParams(args.loaderUrl, {
      page: 1,
      limit: actualPagination.limit,
      ...params,
    });

    fetcher.load(urlWithParams);
  };

  useEffect(() => {
    const newData = args.dataExtractor(fetcher);

    if (newData?.data && newData.data.length > 0 && fetcher.state === 'idle') {
      const meta = actualPagination;

      const key = getDataPageKey(meta ?? {});

      setData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [meta.page ?? 1]: newData.data ?? [],
        },
      }));
    }
  }, [fetcher.state]);

  const mergedData = useMemo(() => {
    const key = getDataPageKey(actualPagination);

    return Object.values(data?.[key] ?? {}).reduce(
      (acc, curr) => [...acc, ...curr],
      [] as T[],
    );
  }, [data, actualPagination]);

  const hasNextPage = actualPagination.totalPages > actualPagination.page;
  const splitedPagination = splitPagination(actualPagination);

  return {
    fetchNextPage,
    filterPages,
    hasNextPage,
    isFetchingNextPage: fetcher.state !== 'idle',
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
