import { RouterModule as NestRouterModule } from '@nestjs/core';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';
import { StatisticsModule } from '~/modules/organization/statistics/statistics.module';
import { ReceiptModule } from '~/modules/organization/receipt/receipt.module';
import { TransactionItemModule } from '~/modules/organization/transaction/transaction-item/transaction-item.module';
import { Module } from '@nestjs/common';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [
    NestRouterModule.register([
      {
        path: 'organizations',
        module: OrganizationModule,
        children: [
          {
            path: '/:organizationName/transactions',
            module: TransactionModule,
            children: [
              { path: '/:transactionId/items', module: TransactionItemModule },
            ],
          },
          {
            path: '/:organizationName/statistics',
            module: StatisticsModule,
          },
          {
            path: '/:organizationName/receipts',
            module: ReceiptModule,
          },
        ],
      },
      {
        path: 'users',
        module: UserModule,
      },
    ]),
  ],
})
export class RouterModule {}
