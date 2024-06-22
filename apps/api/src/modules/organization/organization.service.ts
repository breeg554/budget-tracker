import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '~/entities/organization/organization.entity';
import { CreateOrganizationDto } from '~/dtos/organization/create-organization.dto';
import { User } from '~/entities/user/user.entity';
import { UserService } from '~/modules/organization/user/user.service';
import { OrganizationNotFoundException } from '~/modules/errors/organization-not-found.exception';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly userService: UserService,
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
    const organization = await this.organizationRepository.findOne({
      where: {
        name: name,
      },
      relations: ['users'],
    });

    if (!organization) {
      throw new OrganizationNotFoundException();
    }

    await this.ensureUserInOrganization(userId, organization);

    return organization;
  }

  async ensureUserInOrganization(userId: string, organization: Organization) {
    if (!organization.users.some((orgUser) => orgUser.id === userId)) {
      throw new NotFoundException('Organization not found');
    }
  }
}
