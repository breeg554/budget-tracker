import { z } from 'zod';

import { userSchema } from '~/api/api.contracts';

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
    .transform((res) => {
      const { currentPage, itemsPerPage, ...metaRest } = res.meta;

      return {
        ...res,
        meta: {
          page: currentPage,
          limit: itemsPerPage,
          search: res.meta.search,
          ...metaRest,
        },
      };
    });
};

export type GetUserDto = z.TypeOf<typeof userSchema>;
