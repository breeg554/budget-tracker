import { fromTransactionItemCategoriesResponse } from '~/api/Transaction/transactionApi.contracts';
import { GetTransactionItemCategoryDto } from '~/api/Transaction/transactionApi.types';
import { ParsedResponse, typedFetch, TypedFetch } from '~/utils/fetch';

let categoryCache: ParsedResponse<GetTransactionItemCategoryDto[]> | undefined =
  undefined;

export class TransactionItemCategoryApi {
  private readonly baseUrl = '/transaction-item-categories';
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  async getTransactionItemCategories() {
    if (categoryCache && process.env.NODE_ENV === 'production') {
      return Promise.resolve(categoryCache);
    }

    const categories = await this.client(
      fromTransactionItemCategoriesResponse,
      this.baseUrl,
    );

    categoryCache = categories;

    return categories;
  }
}
