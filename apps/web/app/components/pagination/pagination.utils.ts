export type Pagination = {
  page: number;
  limit: number;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export const paginationDefaults: Pagination = {
  page: 0,
  limit: 20,
};
