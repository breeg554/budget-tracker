import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionItem } from '~/entities/transaction/transactionItem.entity';

import { TransactionItemService } from './transaction-item.service';
import { TransactionItemController } from '~/modules/organization/transaction/transaction-item/transaction-item.controller';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';
import { TransactionItemCategoryModule } from './transaction-item-category/transaction-item-category.module';
import { OrganizationModule } from '~/modules/organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionItem]),
    TransactionModule,
    TransactionItemCategoryModule,
    OrganizationModule,
  ],
  controllers: [TransactionItemController],
  providers: [TransactionItemService],
})
export class TransactionItemModule {}
