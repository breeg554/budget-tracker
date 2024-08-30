import { BadRequestException } from '@nestjs/common';

export class InvalidCredentialsError extends BadRequestException {
  constructor() {
    super('Password or email does not match');
  }
}
