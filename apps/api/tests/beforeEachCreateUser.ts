import { SetupTestingApp } from '~/tests/setup-testing-app';
import { User } from '~/entities/user/user.entity';
import { createUserFixture } from '~/tests-fixtures/user.fixture';

export const beforeEachCreateUser = (
  appSetup: SetupTestingApp,
  user?: Partial<User>,
) => {
  const userFixture = createUserFixture(user);

  beforeEach(async () => {
    await userFixture.saveInDB(appSetup.app);
  });

  return userFixture;
};
