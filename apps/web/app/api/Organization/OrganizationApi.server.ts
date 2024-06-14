import { typedFetch, TypedFetch } from "~/utils/fetch";
import { fromGetOrganizationResponse } from "~/api/Organization/organizationApi.contracts";

export class OrganizationApi {
  private readonly baseUrl = "/organizations";
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  getAll() {
    return this.client(fromGetOrganizationResponse, this.baseUrl, {
      method: "get",
    });
  }
}
