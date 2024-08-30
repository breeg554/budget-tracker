import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SerializeFrom } from '@remix-run/node';
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useNavigation,
} from '@remix-run/react';

import { Pagination } from '~/pagination/pagination.utils';
import { buildUrlWithParams } from '~/utils/url';

interface UseInfiniteFetcherProps<T, R, P = {}> {
  loaderUrl: string;
  dataExtractor: (response: SerializeFrom<R>) => {
    data: T[];
    pagination: Pagination<P>;
  };
}
export const useInfiniteFetcher = <T, R>(
  args: UseInfiniteFetcherProps<T, R>,
) => {
  const navigate = useNavigate();
  const loader = useLoaderData<R>();
  const fetcher = useFetcher<R>();
  const { state: fetchingState } = useNavigation();
  const { pagination, data: freshData } = args.dataExtractor(loader);

  const isIdle = fetchingState === 'idle';

  const [data, setData] = useState<Record<number, T[]>>({
    [pagination.page]: freshData ?? [],
  });

  const hasNextPage = pagination.totalPages > pagination.page;
  const hasPrevPage = getMinMaxPage(data).min > 1;

  useEffect(() => {
    const page = pagination.page;

    const pagesLength = Object.keys(data).length;

    if (page === 1 && pagesLength > 1) {
      setData({
        [page]: freshData ?? [],
      });
    } else {
      setData((prev) => ({
        ...prev,
        [page]: freshData ?? [],
      }));
    }
  }, [pagination, setData]);

  useEffect(() => {
    if (fetcher.state === 'idle' && !!fetcher.data) {
      const prevData = args.dataExtractor(fetcher.data);

      setData((prev) => ({
        [prevData.pagination.page]: prevData.data,
        ...prev,
      }));
    }
  }, [fetcher.state, hasPrevPage]);

  const fetchNextPage = useCallback(() => {
    if (!isIdle || !hasNextPage) return;

    const newPage = pagination.page + 1;

    const params = splitPagination(pagination).filters;

    const urlWithParams = buildUrlWithParams(args.loaderUrl, {
      ...params,
      page: newPage,
    });

    navigate(urlWithParams, { preventScrollReset: true });
  }, [pagination, args.loaderUrl, data, hasNextPage]);

  const fetchPrevPage = useCallback(() => {
    const minMax = getMinMaxPage(data);

    if (!isIdle || minMax.min <= 1) return;

    const newPage = minMax.min - 1;

    const params = splitPagination(pagination).filters;

    const urlWithParams = buildUrlWithParams(args.loaderUrl, {
      ...params,
      page: newPage,
    });

    fetcher.load(urlWithParams);
  }, [pagination, args.loaderUrl, data]);

  const filterPages = (params: Partial<Pagination>) => {
    if (!isIdle) return;

    const urlWithParams = buildUrlWithParams(args.loaderUrl, {
      page: 1,
      limit: pagination.limit,
      ...params,
    });

    navigate(urlWithParams, { preventScrollReset: true });
  };

  const mergedData = useMemo(() => {
    return Object.values(data).reduce(
      (acc, curr) => [...acc, ...curr],
      [] as T[],
    );
  }, [data]);

  const splitedPagination = splitPagination(pagination);

  return {
    fetchNextPage,
    fetchPrevPage,
    filterPages,
    hasNextPage,
    hasPrevPage,
    isFetchingPage: !isIdle,
    data: mergedData,
    filters: splitedPagination.filters,
    ...splitedPagination.meta,
  };
};

function splitPagination(pagination: Partial<Pagination>) {
  const { totalPages, totalItems, page, ...rest } = pagination;

  return { filters: rest, meta: { totalPages, totalItems, page } };
}

function getMinMaxPage(data: Record<number, unknown>) {
  const pages = Object.keys(data).map(Number);

  return {
    min: Math.min(...pages),
    max: Math.max(...pages),
  };
}
