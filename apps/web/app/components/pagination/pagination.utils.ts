export type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export const PAGINATION_DEFAULTS: Pagination = {
  page: 1,
  limit: 20,
  totalItems: 0,
  totalPages: 0,
  search: undefined,
};
