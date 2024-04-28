import { z } from "zod";
import { typedFetch, TypedFetch } from "~/utils/fetch";
import { SignInBody, SignUpBody } from "./authApi.types";

export class AuthApi {
  private readonly baseUrl = "/auth";
  private readonly client: TypedFetch;

  constructor(client: TypedFetch = typedFetch) {
    this.client = client;
  }

  signUp(data: SignUpBody) {
    return this.client(z.any(), `${this.baseUrl}/signup`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  signIn(data: SignInBody) {
    return this.client(z.any(), `${this.baseUrl}/signin`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
