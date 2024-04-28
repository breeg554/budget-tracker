import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionController } from '~/modules/transaction/transaction.controller';
import { TransactionService } from '~/modules/transaction/transaction.service';
import { TransactionItemModule } from '~/modules/transaction/transaction-item/transaction-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), TransactionItemModule],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [],
})
export class TransactionModule {}
