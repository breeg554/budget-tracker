import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '~/entities/transaction/transaction.entity';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { TransactionController } from '~/modules/organization/transaction/transaction.controller';
import { TransactionService } from '~/modules/organization/transaction/transaction.service';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    OrganizationModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
