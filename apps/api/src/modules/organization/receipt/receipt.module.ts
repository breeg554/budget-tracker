import { Module } from '@nestjs/common';
import { ReceiptService } from '~/modules/organization/receipt/receipt.service';
import { ReceiptController } from '~/modules/organization/receipt/receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from '~/entities/receipt/receipt.entity';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { ChatClient } from '~/modules/clients/chat';
import { TransactionItemCategoryModule } from '~/transaction/transaction-item/transaction-item-category/transaction-item-category.module';
import { FileService } from '~/modules/file/file.service';
import { ReceiptScheduledCleanupService } from './receipt-scheduled-cleanup.service';
import { QueueModule } from '~/modules/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt]),
    OrganizationModule,
    TransactionItemCategoryModule,
    QueueModule,
  ],
  controllers: [ReceiptController],
  providers: [
    ReceiptService,
    ChatClient,
    FileService,
    ReceiptScheduledCleanupService,
  ],
  exports: [ReceiptService],
})
export class ReceiptModule {}
