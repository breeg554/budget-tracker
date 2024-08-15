import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ReceiptService } from '~/modules/organization/receipt/receipt.service';
import { AuthUser, User } from '~/modules/auth/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('organizations/:organizationName/receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  process(
    @Param('organizationName') organizationName: string,
    @User() user: AuthUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.receiptService.process(file, {
      organizationName,
      userId: user.id,
      secretName: 'openai',
    });
  }
}
