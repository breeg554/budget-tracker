import { Module } from '@nestjs/common';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { StatisticsService } from '~/modules/organization/statistics/statistics.service';
import { StatisticsController } from '~/modules/organization/statistics/statistics.controller';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    TransactionModule,
    OrganizationModule,
    UserModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
