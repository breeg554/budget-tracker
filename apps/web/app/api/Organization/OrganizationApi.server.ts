import {
  fromGetOrganizationsResponse,
  fromGetOrganizationUsersResponse,
  fromGetSecretResponse,
  getOrganizationSchema,
} from '~/api/Organization/organizationApi.contracts';
import {
  CreateOrganizationDto,
  CreateSecretDto,
} from '~/api/Organization/organizationApi.types';
import { typedFetch, TypedFetch } from '~/utils/fetch';

export class OrganizationApi {
  private readonly baseUrl = '/organizations';
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  getAll() {
    return this.client(fromGetOrganizationsResponse, this.baseUrl, {
      method: 'get',
    });
  }

  create(data: CreateOrganizationDto) {
    return this.client(getOrganizationSchema, this.baseUrl, {
      method: 'post',
      body: JSON.stringify(data),
    });
  }

  getByName(name: string) {
    return this.client(getOrganizationSchema, `${this.baseUrl}/${name}`, {
      method: 'get',
    });
  }

  createSecret(organizationName: string, data: CreateSecretDto) {
    return this.client(
      fromGetSecretResponse,
      `${this.baseUrl}/${organizationName}/secrets`,
      {
        method: 'post',
        body: JSON.stringify(data),
      },
    );
  }

  getUsers(organizationName: string) {
    return this.client(
      fromGetOrganizationUsersResponse,
      `${this.baseUrl}/${organizationName}/users`,
    );
  }
}
