import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { OrganizationService } from '~/modules/organization/organization.service';
import { OrganizationNotFoundError } from '~/modules/organization/errors/organization.error';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private readonly organizationService: OrganizationService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const organizationName = request.params.name;
    const user = request.user;

    if (!organizationName || !user) {
      throw new OrganizationNotFoundError();
    }

    await this.organizationService.ensureUserInOrganization(
      user.id,
      organizationName,
    );

    return true;
  }
}
