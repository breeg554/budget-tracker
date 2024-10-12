import { Injectable } from '@nestjs/common';
import { EncryptionService } from '~/modules/encryption.service';

@Injectable()
export class GatewayEncryptionService {
  constructor(private encryptionService: EncryptionService) {}

  public encrypt(id: string): string {
    return this.encryptionService.encrypt(`${crypto.randomUUID()}:${id}`);
  }

  public decrypt(token: string) {
    const [roomId, userId] = this.encryptionService.decrypt(token).split(':');

    return { roomId, userId };
  }
}
