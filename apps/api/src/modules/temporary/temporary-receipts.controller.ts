import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '~/modules/decorators/public.decorator';
import { TemporaryReceiptsService } from '~/modules/temporary/temporary-receipts.service';
import { TemporaryReceiptNotFoundError } from '~/modules/temporary/errors/temporary-receipts.error';

@Controller('receipts')
export class TemporaryReceiptsController {
  constructor(
    private readonly temporaryReceiptService: TemporaryReceiptsService,
  ) {}

  @Public()
  @Get(':organizationName/:userId/:fileName')
  async getReceipt(@Query('token') token: string, @Res() res: Response) {
    if (!token) throw new TemporaryReceiptNotFoundError();

    const path = this.temporaryReceiptService.getReceiptPath(token);

    return res.status(200).sendfile(path);
  }
}
