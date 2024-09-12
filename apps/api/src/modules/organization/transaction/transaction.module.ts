import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '~/entities/transaction/transaction.entity';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { TransactionItemModule } from '~/modules/organization/transaction/transaction-item/transaction-item.module';
import { TransactionController } from '~/modules/organization/transaction/transaction.controller';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { UserModule } from '~/modules/user/user.module';
import { TransactionItemService } from '~/modules/organization/transaction/transaction-item/transaction-item.service';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionItem]),
    TransactionItemModule,
    OrganizationModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionItemService],
  exports: [TransactionService],
})
export class TransactionModule {}
