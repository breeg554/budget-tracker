import { SetupTestingApp } from '~/tests/setup-testing-app';
import { User } from '~/entities/user/user.entity';
import { Organization } from '~/entities/organization/organization.entity';
import { createOrganizationFixture } from '~/tests-fixtures/organization.fixture';

export const beforeEachCreateOrganization = (
  appSetup: SetupTestingApp,
  user: User,
  organization?: Partial<Organization>,
) => {
  const organizationFixture = createOrganizationFixture(organization);

  beforeEach(async () => {
    await organizationFixture.saveInDB(appSetup.app, user.id);
  });

  return organizationFixture;
};
