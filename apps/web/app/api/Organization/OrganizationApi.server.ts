import { typedFetch, TypedFetch } from "~/utils/fetch";
import {
  fromGetOrganizationsResponse,
  getOrganizationSchema,
} from "~/api/Organization/organizationApi.contracts";

export class OrganizationApi {
  private readonly baseUrl = "/organizations";
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  getAll() {
    return this.client(fromGetOrganizationsResponse, this.baseUrl, {
      method: "get",
    });
  }

  getByName(name: string) {
    return this.client(getOrganizationSchema, `${this.baseUrl}/${name}`, {
      method: "get",
    });
  }
}
