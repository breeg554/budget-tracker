export class UnknownAPIError extends Error {
  constructor() {
    super('Unknown API error');
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class NotFoundError extends Error {
  constructor() {
    super('Not found');
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends Error {
  constructor(public readonly fieldErrors: Record<string, string[]>) {
    super();
  }
}
