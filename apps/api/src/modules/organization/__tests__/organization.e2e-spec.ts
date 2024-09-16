import { SetupTestingApp } from 'test/setup-testing-app';

import { OrganizationController } from '../organization.controller';

describe(OrganizationController.name, () => {
  const setup = new SetupTestingApp();

  beforeAll(async () => {
    await setup.init();
  });

  beforeEach(async () => {
    await setup.cleanup();
  });

  afterAll(async () => {
    await setup.close();
  });

  describe('(GET)', () => {
    it('should return 200', async () => {
      // const response = await createGetRequest();
      //
      // expect(response.status).toBe(200);
      // expect(response.body).toEqual([]);
    });
  });
});
