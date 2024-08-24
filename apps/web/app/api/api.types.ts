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
      }),
    })
    .transform((res) => ({
      ...res,
      meta: {
        totalItems: res.meta.totalItems,
        totalPages: res.meta.totalPages,
        page: res.meta.currentPage,
        limit: res.meta.itemsPerPage,
      },
    }));
};
