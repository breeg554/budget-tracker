import { ArgumentsHost, Catch, BadRequestException } from '@nestjs/common';
import {
  ReceiptError,
  ReceiptParseError,
  ReceiptSchemaError,
} from './receipt.error';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(ReceiptSchemaError, ReceiptError, ReceiptParseError)
export class ReceiptExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (
      exception instanceof ReceiptSchemaError ||
      exception instanceof ReceiptParseError
    ) {
      super.catch(new BadRequestException(exception.message), host);
    }

    if (exception instanceof ReceiptError) {
      super.catch(
        new BadRequestException(exception.message, { cause: exception.cause }),
        host,
      );
    }

    super.catch(exception, host);
  }
}
