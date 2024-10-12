import { Module } from '@nestjs/common';
import { GatewayEncryptionService } from './gateway-encryption.service';
import { EncryptionService } from '~/modules/encryption.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EncryptionService, GatewayEncryptionService],
  exports: [EncryptionService, GatewayEncryptionService],
})
export class GatewayModule {}
