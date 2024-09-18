import { INestApplication } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Organization } from '~/entities/organization/organization.entity';
import { OrganizationService } from '~/modules/organization/organization.service';

export class OrganizationFixture {
  private _organization: Organization;

  constructor(organization?: Partial<Organization>) {
    this._organization = {
      id: uuidv4(),
      name: 'super-org',
      createdAt: new Date(),
      updatedAt: new Date(),
      users: [],
      transactions: [],
      ...organization,
    };
  }

  async saveInDB(app: INestApplication, userId?: string) {
    const organizationService = app.get(OrganizationService);
    this._organization = await organizationService.create(
      this.organization,
      userId,
    );

    return this;
  }

  get organization() {
    return this._organization;
  }
}

export const createOrganizationFixture = (
  organization?: Partial<Organization>,
) => new OrganizationFixture(organization);
