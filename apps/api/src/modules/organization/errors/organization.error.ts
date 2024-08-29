import { NotFoundException } from '@nestjs/common';

export class OrganizationNotFoundError extends NotFoundException {
  constructor() {
    super('Organization not found');
  }
}
