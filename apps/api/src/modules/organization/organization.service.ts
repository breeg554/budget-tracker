import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrganizationDto } from '~/dtos/organization/create-organization.dto';
import { Organization } from '~/entities/organization/organization.entity';
import { User } from '~/entities/user/user.entity';
import { UserService } from '~/modules/organization/user/user.service';
import { SecretService } from '~/modules/organization/secret/secret.service';
import { Secret } from '~/entities/secret/secret.entity';
import { CreateSecretDto } from '~/dtos/secret/create-secret.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly userService: UserService,
    private readonly secretService: SecretService,
  ) {}

  async create(
    data: CreateOrganizationDto,
    userId?: string,
  ): Promise<Organization> {
    let user: User | null = null;

    if (userId) {
      user = await this.userService.findOne(userId);
    }

    const organization = this.organizationRepository.create(data);

    if (user) {
      organization.users = [user];
    }

    return this.organizationRepository.save(organization);
  }

  async findByName(name: string): Promise<Organization> {
    return this.organizationRepository.findOne({
      where: { name },
      relations: ['users'],
    });
  }

  async findAllByUser(email: string): Promise<Organization[]> {
    return this.organizationRepository.findBy({
      users: { email },
    });
  }

  async findByNameAndUser(name: string, userId: string): Promise<Organization> {
    return await this.ensureUserInOrganization(userId, name);
  }

  async findOrganizationSecret(
    secretName: string,
    organizationName: string,
    userId: string,
  ): Promise<Secret> {
    const organization = await this.ensureUserInOrganization(
      userId,
      organizationName,
    );
    return this.secretService.findOne(secretName, organization.id);
  }

  async createSecret(
    data: CreateSecretDto,
    organizationName: string,
    userId: string,
  ): Promise<Secret> {
    const organization = await this.ensureUserInOrganization(
      userId,
      organizationName,
    );

    return this.secretService.create(data, organization.id);
  }

  async ensureUserInOrganization(
    userId: string,
    organizationName: string,
  ): Promise<Organization> {
    const organization = await this.findByName(organizationName);

    if (
      !organization ||
      !organization.users.some((orgUser) => orgUser.id === userId)
    ) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}
