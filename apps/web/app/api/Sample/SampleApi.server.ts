import { typedFetch, TypedFetch } from "~/utils/fetch";
import { fromTodosResponse } from "./sampleApi.contracts";
import { z } from "zod";

export class SampleApi {
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  getSampleData() {
    return this.client(z.any(), "/users");
  }
}
