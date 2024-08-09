import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Secret } from '~/entities/secret/secret.entity';
import { SecretService } from './secret.service';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { EncryptionService } from '~/modules/encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([Secret])],
  controllers: [],
  providers: [SecretService, EncryptionService],
  exports: [SecretService, EncryptionService],
})
export class SecretModule {}
