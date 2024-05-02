import { typedFetch, TypedFetch } from "~/utils/fetch";
import {
  CreateTransactionSchema,
  fromGetTransactionsResponse,
} from "./transactionApi.contracts";
import { z } from "zod";

export class TransactionApi {
  private readonly baseUrl = "/transactions";
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  create(data: CreateTransactionSchema) {
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
