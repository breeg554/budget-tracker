import { z } from 'zod';

export const createPaginatedSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return z
    .object({
      data: schema,
      meta: z.object({
        itemsPerPage: z.number(),
        totalItems: z.number(),
        currentPage: z.number(),
        totalPages: z.number(),
        search: z.string().optional(),
      }),
    })
    .transform((res) => ({
      ...res,
      meta: {
        page: res.meta.currentPage,
        limit: res.meta.itemsPerPage,
        search: res.meta.search,
        ...res.meta,
      },
    }));
};
