import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Organization } from '~/entities/organization/organization.entity';
import { User } from '~/entities/user/user.entity';
import { OrganizationController } from '~/modules/organization/organization.controller';
import { OrganizationService } from '~/modules/organization/organization.service';
import { UserModule } from '~/modules/organization/user/user.module';
import { SecretModule } from '~/modules/organization/secret/secret.module';
import { Secret } from '~/entities/secret/secret.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, User, Secret]),
    UserModule,
    OrganizationModule,
    SecretModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationService],
  exports: [TypeOrmModule, OrganizationService],
})
export class OrganizationModule {}
