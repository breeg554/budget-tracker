import { json } from '@remix-run/node';

import { TransactionItemCategoryApi } from '~/api/Transaction/TransactionItemCategoryApi.server';
import { getPaginationFromUrl } from '~/pagination/getPaginationFromUrl';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';
import { getUrlArrayParam } from '~/utils/url';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);

  assert(params.organizationName);

  const { search } = getPaginationFromUrl(request.url);

  const categoryApi = new TransactionItemCategoryApi(fetch);

  const categoriesPromise = categoryApi.getTransactionItemCategories();

  const [categories] = await Promise.all([categoriesPromise]);

  const category = getUrlArrayParam(
    new URL(request.url).searchParams.get('category'),
  );

  return json({
    search,
    category,
    categories: categories.data,
    organizationName: params.organizationName,
  });
});
