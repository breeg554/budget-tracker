import { Module } from '@nestjs/common';
import { ReceiptService } from '~/modules/organization/receipt/receipt.service';
import { ReceiptController } from '~/modules/organization/receipt/receipt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from '~/entities/receipt/receipt.entity';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { TransactionItemCategoryModule } from '~/transaction/transaction-item/transaction-item-category/transaction-item-category.module';
import { QueueModule } from '~/modules/queue/queue.module';
import { ReceiptGateway } from '~/modules/organization/receipt/receipt.gateway';
import { GatewayModule } from '~/modules/gateways/gateway.module';
import { ReceiptProcessor } from '~/modules/organization/receipt/receipt.processor';
import { StorageModule } from '~/modules/storage/storage.module';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt]),
    OrganizationModule,
    UserModule,
    TransactionItemCategoryModule,
    QueueModule,
    GatewayModule,
    StorageModule,
  ],
  controllers: [ReceiptController],
  providers: [ReceiptGateway, ReceiptService, ReceiptProcessor],
  exports: [ReceiptService],
})
export class ReceiptModule {}
