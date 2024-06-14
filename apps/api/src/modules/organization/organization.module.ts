import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '~/entities/organization/organization.entity';
import { OrganizationController } from '~/modules/organization/organization.controller';
import { OrganizationService } from '~/modules/organization/organization.service';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';
import { UserModule } from '~/modules/organization/user/user.module';
import { User } from '~/entities/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, User]),
    TransactionModule,
    UserModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [],
})
export class OrganizationModule {}
