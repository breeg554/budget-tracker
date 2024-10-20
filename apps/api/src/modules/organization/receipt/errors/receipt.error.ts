export class ReceiptParseError extends Error {
  constructor() {
    super('Invalid JSON format');
  }
}

export class ReceiptSchemaError extends Error {
  constructor() {
    super('Failed to parse receipt');
  }
}

export class ReceiptError extends Error {
  constructor(readonly cause: Error) {
    super('Unknown error occurred while processing receipt. Please try again.');
  }
}

export class ReceiptCreateFailedError extends Error {
  constructor(readonly cause: Error) {
    super('Failed to create receipt');
  }
}
