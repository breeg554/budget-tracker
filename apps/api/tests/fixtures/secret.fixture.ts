import { INestApplication } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Secret } from '~/entities/secret/secret.entity';
import { SecretService } from '~/modules/organization/secret/secret.service';

export class SecretFixture {
  private _secret: Secret;

  constructor(secret?: Partial<Secret>) {
    this._secret = {
      id: uuidv4(),
      name: 'super-secret',
      value: 'super-secret-value',
      organization: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...secret,
    };
  }

  async saveInDB(app: INestApplication) {
    const secretService = app.get(SecretService);

    await secretService.create(this.secret, this.secret.organization.id);

    return this;
  }

  get secret() {
    return this._secret;
  }
}

export const createSecretFixture = (secret?: Partial<Secret>) =>
  new SecretFixture(secret);
