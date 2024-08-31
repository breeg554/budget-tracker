import { json } from '@remix-run/node';

import { OrganizationApi } from '~/api/Organization/OrganizationApi.server';
import { TransactionItemCategoryApi } from '~/api/Transaction/TransactionItemCategoryApi.server';
import { getPaginationFromUrl } from '~/pagination/getPaginationFromUrl';
import { requireSignedIn } from '~/session.server';
import { assert } from '~/utils/assert';
import { loaderHandler } from '~/utils/loader.server';
import { getUrlArrayParam } from '~/utils/url';

export const loader = loaderHandler(async ({ request, params }, { fetch }) => {
  await requireSignedIn(request);

  assert(params.organizationName);

  const { search, startDate, endDate } = getPaginationFromUrl(request.url);

  const organizationApi = new OrganizationApi(fetch);
  const categoryApi = new TransactionItemCategoryApi(fetch);

  const categoriesPromise = categoryApi.getTransactionItemCategories();
  const organizationUsersPromise = organizationApi.getUsers(
    params.organizationName,
  );

  const [categories, organizationUsers] = await Promise.all([
    categoriesPromise,
    organizationUsersPromise,
  ]);

  const category = getUrlArrayParam(
    new URL(request.url).searchParams.get('category'),
  );

  const author = getUrlArrayParam(
    new URL(request.url).searchParams.get('author'),
  );

  return json({
    search,
    author,
    category,
    endDate,
    startDate,
    categories: categories.data,
    organizationName: params.organizationName,
    organizationUsers: organizationUsers.data,
  });
});
