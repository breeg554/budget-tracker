import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionItem } from '~/entities/transaction/transactionItem.entity';

import { TransactionItemCategoryModule } from './transaction-item-category/transaction-item-category.module';
import { TransactionItemService } from './transaction-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionItem]),
    TransactionItemCategoryModule,
  ],
  controllers: [],
  providers: [TransactionItemService],
})
export class TransactionItemModule {}
