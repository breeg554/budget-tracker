import { NotFoundException } from '@nestjs/common';

export class TemporaryReceiptNotFoundError extends NotFoundException {
  constructor() {
    super('Receipt not found');
  }
}
