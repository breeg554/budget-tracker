import { typedFetch, TypedFetch } from "~/utils/fetch";
import { fromTodosResponse } from "./sampleApi.contracts";

export class SampleApi {
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  getSampleData() {
    return this.client(fromTodosResponse, "/RedisTest");
  }
}
