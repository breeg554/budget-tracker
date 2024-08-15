import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Secret } from '~/entities/secret/secret.entity';
import { CreateSecretDto } from '~/dtos/secret/create-secret.dto';
import { EncryptionService } from '~/modules/encryption.service';

@Injectable()
export class SecretService {
  constructor(
    @InjectRepository(Secret)
    private readonly secretRepository: Repository<Secret>,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(
    createSecretDto: CreateSecretDto,
    organizationId: string,
  ): Promise<Secret> {
    const encrypted = this.encryptionService.encrypt(createSecretDto.value);

    const secret = this.secretRepository.create({
      ...createSecretDto,
      value: encrypted,
      organization: { id: organizationId },
    });

    await this.secretRepository.upsert(secret, {
      conflictPaths: ['name', 'organization'],
    });

    return this.findOne(secret.name, organizationId);
  }

  async findAll(organizationId: string): Promise<Secret[]> {
    return this.secretRepository.find({
      where: { organization: { id: organizationId } },
    });
  }

  async findOne(name: string, organizationId: string): Promise<Secret> {
    const secret = await this.secretRepository.findOne({
      where: { name, organization: { id: organizationId } },
    });

    if (!secret) throw new NotFoundException('Secret not found');

    secret.value = this.encryptionService.decrypt(secret.value);

    return secret;
  }
}
