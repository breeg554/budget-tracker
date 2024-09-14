import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionItem } from '~/entities/transaction/transactionItem.entity';

import { TransactionItemService } from './transaction-item.service';
import { TransactionItemController } from '~/modules/organization/transaction/transaction-item/transaction-item.controller';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionItem]), TransactionModule],
  controllers: [TransactionItemController],
  providers: [TransactionItemService],
})
export class TransactionItemModule {}
