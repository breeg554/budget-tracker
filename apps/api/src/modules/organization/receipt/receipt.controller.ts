import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptExceptionFilter } from '~/modules/organization/receipt/errors/receipt-exception.filter';
import { OrganizationGuard } from '~/modules/guards/organization-guard';
import {
  createDiscFileStorage,
  FileService,
} from '~/modules/file/file.service';
import * as fs from 'fs';
import { ReceiptService } from '~/modules/organization/receipt/receipt.service';
import { Public } from '~/modules/decorators/public.decorator';

@Controller()
export class ReceiptController {
  constructor(
    private fileService: FileService,
    private receiptService: ReceiptService,
  ) {}

  @Public()
  @Get('/temporary/:fileName')
  async getTemporaryReceiptFile(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    if (fs.existsSync(this.fileService.getFilePath(fileName))) {
      return res.sendFile(this.fileService.getFilePath(fileName));
    } else {
      throw new NotFoundException('File not found');
    }
  }

  @Post('upload')
  @UseGuards(OrganizationGuard)
  @UseFilters(ReceiptExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createDiscFileStorage().getDiskStorage(),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('name') organizationName: string,
  ) {
    return {
      fileUrl: this.receiptService.getTemporaryReceiptUrl(
        organizationName,
        file.filename,
      ),
      fileName: file.filename,
      originalName: file.originalname,
    };
  }
}
