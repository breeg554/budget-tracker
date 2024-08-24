import { useEffect, useMemo, useState } from 'react';
import type { SerializeFrom } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import type { FetcherWithComponents } from '@remix-run/react';

import { Pagination } from '~/pagination/pagination.utils';
import { buildUrlWithParams } from '~/utils/url';

import { usePagination } from './usePagination';

interface UseInfiniteFetcherProps<T, R> {
  loaderUrl: string;
  pagination: Pagination;
  initialData?: T[];
  dataExtractor: (
    response: FetcherWithComponents<SerializeFrom<R>>,
  ) => undefined | T[];
}

export const useInfiniteFetcher = <T, R>(
  args: UseInfiniteFetcherProps<T, R>,
) => {
  const fetcher = useFetcher<R>();
  const { page, limit, search, goToNext, hasNextPage } = usePagination(
    args.pagination,
  );

  const [data, setData] = useState<Record<number, T[]>>({
    [page]: args?.initialData ?? [],
  });

  const fetchNextPage = () => {
    if (fetcher.state !== 'idle') return;
    goToNext?.();
  };

  useEffect(() => {
    if (data[page] !== undefined) return;

    const urlWithParams = buildUrlWithParams(args.loaderUrl, {
      page,
      limit,
      search,
    });

    fetcher.load(urlWithParams);
  }, [page, limit, search]);

  useEffect(() => {
    const newData = args.dataExtractor(fetcher);

    if (newData && newData.length > 0) {
      setData((prev) => ({ ...prev, [page]: newData }));
    }
  }, [fetcher.data]);

  const mergedData = useMemo(() => {
    return Object.values(data).reduce(
      (acc, curr) => [...acc, ...curr],
      [] as T[],
    );
  }, [data]);

  return {
    page,
    limit,
    search,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage: fetcher.state !== 'idle',
    data: mergedData,
  };
};
