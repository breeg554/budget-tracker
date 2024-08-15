import { fromReceiptProcessResponse } from '~/api/Receipt/receiptApi.contracts';
import { typedFetch, TypedFetch } from '~/utils/fetch';

export class ReceiptApi {
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  processReceipt(organizationName: string, data: FormData) {
    return this.client(
      fromReceiptProcessResponse,
      `/organizations/${organizationName}/receipts`,
      {
        method: 'POST',
        body: data,
      },
    );
  }
}
