import { NotFoundException } from '@nestjs/common';

export class OrganizationNotFoundException extends NotFoundException {
  constructor() {
    super('Organization not found');
  }
}
