import { fromUploadReceiptSchema } from '~/api/Receipt/receiptApi.contracts';
import { typedFetch, TypedFetch } from '~/utils/fetch';

export class ReceiptApi {
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  upload(organizationName: string, data: FormData) {
    return this.client(
      fromUploadReceiptSchema,
      `/organizations/${organizationName}/receipts/upload`,
      {
        method: 'POST',
        body: data,
      },
    );
  }
}
