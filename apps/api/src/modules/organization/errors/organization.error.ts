import { BadRequestException, NotFoundException } from '@nestjs/common';

export class OrganizationNotFoundError extends NotFoundException {
  constructor() {
    super('Organization not found');
  }
}

export class OrganizationAlreadyExistsError extends BadRequestException {
  constructor() {
    super('Organization already exists');
  }
}
