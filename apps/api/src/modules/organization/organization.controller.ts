import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { CreateOrganizationDto } from '~/dtos/organization/create-organization.dto';
import { GetOrganizationDto } from '~/dtos/organization/get-organization.dto';
import { AuthUser, User } from '~/modules/auth/decorators/user.decorator';
import { OrganizationService } from '~/modules/organization/organization.service';

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
  findAll(@User() user: any): Promise<GetOrganizationDto> {
    return this.organizationService.findAllByUser(user.email);
  }

  @Get(':name')
  findByName(
    @Param('name') name: string,
    @User() user: AuthUser,
  ): Promise<GetOrganizationDto> {
    return this.organizationService.findByNameAndUser(name, user.id);
  }
}
