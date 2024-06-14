import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionController } from '~/modules/organization/transaction/transaction.controller';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { TransactionItemModule } from '~/modules/organization/transaction/transaction-item/transaction-item.module';
import { OrganizationModule } from '~/modules/organization/organization.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TransactionItemModule,
    OrganizationModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService, TypeOrmModule],
})
export class TransactionModule {}
