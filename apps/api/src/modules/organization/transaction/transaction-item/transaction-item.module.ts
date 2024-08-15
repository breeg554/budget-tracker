import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionItem } from '~/entities/transaction/transactionItem.entity';

import { TransactionItemService } from './transaction-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionItem])],
  controllers: [],
  providers: [TransactionItemService],
})
export class TransactionItemModule {}
