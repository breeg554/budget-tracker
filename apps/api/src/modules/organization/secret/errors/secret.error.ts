export class SecretNotFoundError extends Error {
  constructor() {
    super('Secret not found');
  }
}
