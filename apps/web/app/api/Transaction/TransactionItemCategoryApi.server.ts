import { fromTransactionItemCategoriesResponse } from '~/api/Transaction/transactionApi.contracts';
import { typedFetch, TypedFetch } from '~/utils/fetch';

export class TransactionItemCategoryApi {
  private readonly baseUrl = '/transaction-item-categories';
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  getTransactionItemCategories() {
    return this.client(fromTransactionItemCategoriesResponse, this.baseUrl);
  }
}
