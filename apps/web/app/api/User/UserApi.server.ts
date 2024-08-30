import { userSchema } from '~/api/api.contracts';
import { typedFetch, TypedFetch } from '~/utils/fetch';

export class UserApi {
  private readonly baseUrl = '/users';
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  me() {
    return this.client(userSchema, `${this.baseUrl}/me`);
  }

  meWithSessionCookie(cookie: string) {
    return this.client(userSchema, `${this.baseUrl}/me`, {
      headers: { Cookie: cookie },
    });
  }
}
