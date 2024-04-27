import { z } from "zod";
import { typedFetch, TypedFetch } from "~/utils/fetch";
import { SignInBody, SignUpBody } from "./authApi.types";
import { fromSignInResponse } from "~/api/Auth/authApi.contracts";

export class AuthApi {
  private readonly baseUrl = "/auth";
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  signUp(data: SignUpBody) {
    return this.client(z.any(), `${this.baseUrl}/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  signIn(data: SignInBody) {
    return this.client(fromSignInResponse, `${this.baseUrl}/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  refreshToken(refreshToken: string) {
    return this.client(fromSignInResponse, `${this.baseUrl}/refresh`, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }
}
