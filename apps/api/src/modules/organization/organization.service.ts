import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '~/entities/organization/organization.entity';
import { CreateOrganizationDto } from '~/dtos/organization/create-organization.dto';
import { User } from '~/entities/user/user.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    data: CreateOrganizationDto,
    userId?: string,
  ): Promise<Organization> {
    let user: User | null = null;

    if (userId) {
      user = await this.userRepository.findOne({ where: { id: userId } });
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

  async findByNameAndUser(name: string, userId: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: {
        name: name,
        users: { id: userId },
      },
      relations: ['users'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization ${name} not found`);
    }

    return organization;
  }
}
