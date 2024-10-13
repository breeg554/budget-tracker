import {
  Controller,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptExceptionFilter } from '~/modules/organization/receipt/errors/receipt-exception.filter';
import { OrganizationGuard } from '~/modules/guards/organization-guard';
import {
  createDiscFileStorage,
  FileService,
} from '~/modules/file/file.service';

@Controller()
export class ReceiptController {
  constructor(private fileService: FileService) {}

  @Post('upload')
  @UseGuards(OrganizationGuard)
  @UseFilters(ReceiptExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: createDiscFileStorage().getDiskStorage(),
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return {
      fileUrl: this.fileService.getFileUrl(file.filename),
      fileName: file.filename,
      originalName: file.originalname,
    };
  }
}
