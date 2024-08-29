import { RouterModule as NestRouterModule } from '@nestjs/core';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';
import { StatisticsModule } from '~/modules/organization/statistics/statistics.module';
import { ReceiptModule } from '~/modules/organization/receipt/receipt.module';
import { Module } from '@nestjs/common';

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
    ]),
  ],
})
export class RouterModule {}
