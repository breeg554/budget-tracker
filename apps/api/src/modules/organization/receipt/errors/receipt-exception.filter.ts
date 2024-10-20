import { ArgumentsHost, Catch, BadRequestException } from '@nestjs/common';
import {
  ReceiptCreateFailedError,
  ReceiptError,
  ReceiptParseError,
  ReceiptSchemaError,
} from './receipt.error';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch(
  ReceiptSchemaError,
  ReceiptError,
  ReceiptParseError,
  ReceiptCreateFailedError,
)
export class ReceiptExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof ReceiptCreateFailedError) {
      super.catch(
        new BadRequestException(exception.message, { cause: exception.cause }),
        host,
      );
    }

    super.catch(exception, host);
  }
}
