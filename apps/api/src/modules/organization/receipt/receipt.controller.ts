import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReceiptExceptionFilter } from '~/modules/organization/receipt/errors/receipt-exception.filter';
import { OrganizationGuard } from '~/modules/guards/organization-guard';
import { ReceiptService } from '~/modules/organization/receipt/receipt.service';
import { StorageClient } from '~/modules/storage/interfaces/storage-client.interface';
import { AuthUser, User } from '~/modules/decorators/user.decorator';
import { CreateReceiptDto } from '~/dtos/receipt/create-receipt.dto';

@Controller()
export class ReceiptController {
  constructor(
    private receiptService: ReceiptService,
    private readonly storageClient: StorageClient,
  ) {}

  @Post('upload')
  @UseGuards(OrganizationGuard)
  @UseFilters(ReceiptExceptionFilter)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(jpg|jpeg|png)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Param('name') organizationName: string,
    @User() user: AuthUser,
  ): Promise<CreateReceiptDto> {
    const receipt = await this.receiptService.upload(
      file,
      organizationName,
      user.id,
    );

    const url = await this.storageClient.getSignedUrl(receipt.key);

    return {
      fileUrl: url,
      fileKey: receipt.key,
      originalName: file.originalname,
    };
  }
}
