import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Organization } from '~/entities/organization/organization.entity';
import { User } from '~/entities/user/user.entity';
import { OrganizationController } from '~/modules/organization/organization.controller';
import { OrganizationService } from '~/modules/organization/organization.service';
import { UserModule } from '~/modules/organization/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User]), UserModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [TypeOrmModule, OrganizationService],
})
export class OrganizationModule {}
