import { ArgumentsHost, Catch, NotFoundException } from '@nestjs/common';
import { SecretNotFoundError } from '~/modules/organization/secret/errors/secret.error';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(SecretNotFoundError)
export class SecretExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof SecretNotFoundError) {
      super.catch(new NotFoundException(exception.message), host);
    }

    super.catch(exception, host);
  }
}
