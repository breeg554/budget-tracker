import { typedFetch, TypedFetch } from "~/utils/fetch";
import { z } from "zod";
import { CreateTransactionDto } from "~/api/Transaction/transactionApi.types";
import { fromGetTransactionsResponse } from "./transactionApi.contracts";

export class TransactionApi {
  private readonly baseUrl = "/transactions";
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  create(data: CreateTransactionDto) {
    return this.client(z.any(), this.baseUrl, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  getAll() {
    return this.client(fromGetTransactionsResponse, this.baseUrl, {
      method: "get",
    });
  }
}
