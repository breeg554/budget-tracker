import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateOrganizationDto } from '~/dtos/organization/create-organization.dto';
import { GetOrganizationDto } from '~/dtos/organization/get-organization.dto';
import { AuthUser, User } from '~/modules/auth/decorators/user.decorator';
import { OrganizationService } from '~/modules/organization/organization.service';
import { CreateSecretDto } from '~/dtos/secret/create-secret.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(
    @Body() data: CreateOrganizationDto,
    @User() user: AuthUser,
  ): Promise<any> {
    return this.organizationService.create(data, user.id);
  }

  @Get()
  findAll(@User() user: AuthUser): Promise<GetOrganizationDto> {
    return this.organizationService.findAllByUser(user.email);
  }

  @Get(':name')
  findByName(
    @Param('name') name: string,
    @User() user: AuthUser,
  ): Promise<GetOrganizationDto> {
    return this.organizationService.findByNameAndUser(name, user.id);
  }

  @Post(':name/secrets')
  createSecret(
    @Param('name') name: string,
    @Body() data: CreateSecretDto,
    @User() user: AuthUser,
  ): Promise<any> {
    return this.organizationService.createSecret(data, name, user.id);
  }

  @Get(':name/secrets/:secretName')
  getOrganizationSecret(
    @Param('secretName') secretName: string,
    @Param('name') organizationName: string,
    @User() user: AuthUser,
  ): Promise<any> {
    return this.organizationService.findOrganizationSecret(
      secretName,
      organizationName,
      user.id,
    );
  }
}
