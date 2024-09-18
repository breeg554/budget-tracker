import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrganizationDto } from '~/dtos/organization/create-organization.dto';
import { Organization } from '~/entities/organization/organization.entity';
import { User } from '~/entities/user/user.entity';
import { UserService } from '~/modules/user/user.service';
import { SecretService } from '~/modules/organization/secret/secret.service';
import { Secret } from '~/entities/secret/secret.entity';
import { CreateSecretDto } from '~/dtos/secret/create-secret.dto';
import {
  OrganizationAlreadyExistsError,
  OrganizationNotFoundError,
} from '~/modules/organization/errors/organization.error';

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

    if (await this.findByName(data.name)) {
      throw new OrganizationAlreadyExistsError();
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

  async findOrganizationUsers(
    organizationName: string,
    userId: string,
  ): Promise<User[]> {
    const organization = await this.ensureUserInOrganization(
      userId,
      organizationName,
    );

    return organization.users;
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
    const organization = await this.organizationRepository.findOne({
      where: { name: organizationName },
      relations: ['users'],
    });

    if (!organization) throw new OrganizationNotFoundError();

    if (
      !organization ||
      !organization.users.some((orgUser) => orgUser.id === userId)
    ) {
      throw new OrganizationNotFoundError();
    }

    return organization;
  }
}
