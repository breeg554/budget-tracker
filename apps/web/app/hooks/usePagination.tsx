import { useState } from 'react';

import { Pagination, PAGINATION_DEFAULTS } from '~/pagination/pagination.utils';

export const usePagination = (initialPagination?: Partial<Pagination>) => {
  const [pagination, setPagination] = useState({
    ...PAGINATION_DEFAULTS,
    ...initialPagination,
  });

  const changeSearch = (search: string) => {
    setPagination((prev) => ({ ...prev, search, page: 1 }));
  };

  const goToNext =
    pagination.totalPages > pagination.page
      ? () => {
          setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      : undefined;

  const goToPrev =
    pagination.page > 0
      ? () => {
          setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
        }
      : undefined;

  const goToPage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return {
    ...pagination,
    changeSearch,
    goToNext,
    goToPrev,
    goToPage,
    hasNextPage: pagination.totalPages > pagination.page,
  };
};
