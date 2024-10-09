import {
  Controller,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ReceiptService } from '~/modules/organization/receipt/receipt.service';
import { AuthUser, User } from '~/modules/decorators/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptExceptionFilter } from '~/modules/organization/receipt/errors/receipt-exception.filter';
import { OrganizationGuard } from '~/modules/guards/organization-guard';
import { createDiscFileStorage } from '~/modules/file/file.service';

@Controller()
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @UseGuards(OrganizationGuard)
  @UseFilters(ReceiptExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createDiscFileStorage().getDiskStorage(),
    }),
  )
  process(
    @Param('name') organizationName: string,
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
