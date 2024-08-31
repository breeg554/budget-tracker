import { json } from '@remix-run/node';

import { TransactionApi } from '~/api/Transaction/TransactionApi.server';
import { TransactionItemCategoryApi } from '~/api/Transaction/TransactionItemCategoryApi.server';
import { getPaginationFromUrl } from '~/pagination/getPaginationFromUrl';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';
import { getUrlArrayParam } from '~/utils/url';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);

  assert(params.organizationName);

  const { page, search, startDate, endDate } = getPaginationFromUrl(
    request.url,
  );

  const transactionApi = new TransactionApi(fetch);
  const categoryApi = new TransactionItemCategoryApi(fetch);

  const categoriesPromise = categoryApi.getTransactionItemCategories();

  const categoriesQuery =
    new URL(request.url).searchParams.get('category') ?? undefined;
  const authorsQuery =
    new URL(request.url).searchParams.get('author') ?? undefined;

  const transactionsPromise = transactionApi.getAll(params.organizationName, {
    page,
    search,
    endDate,
    startDate,
    category: categoriesQuery,
    author: authorsQuery,
    limit: 10,
  });

  const [categories, transactions] = await Promise.all([
    categoriesPromise,
    transactionsPromise,
  ]);

  return json({
    organizationName: params.organizationName,
    transactions: transactions.data.data,
    pagination: {
      ...transactions.data.meta,
      category: getUrlArrayParam(categoriesQuery),
      author: getUrlArrayParam(authorsQuery),
      startDate,
      endDate,
    },
    categories: categories.data,
  });
});
