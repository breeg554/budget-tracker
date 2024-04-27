export class UnknownAPIError extends Error {
  constructor() {
    super("Unknown API error");
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

export class NotFoundError extends Error {
  constructor() {
    super("Not found");
  }
}

export class ValidationError extends Error {
  constructor() {
    super("Validation Error");
  }
}
