import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { TransactionController } from '~/modules/organization/transaction/transaction.controller';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { TransactionItemModule } from '~/modules/organization/transaction/transaction-item/transaction-item.module';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { OrganizationService } from '~/modules/organization/organization.service';
import { UserService } from '~/modules/organization/user/user.service';
import { UserModule } from '~/modules/organization/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TransactionItemModule,
    OrganizationModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
