import { HttpStatus } from '@nestjs/common';
import { setupTestingApp } from '~/tests/setup-testing-app';
import { beforeEachCreateUser } from '~/tests/before-each-create-user';
import { beforeEachCreateOrganization } from '~/tests/before-each-create-organization';
import { StatisticsController } from '../statistics.controller';
import { createTransactionItemCategoryFixture } from '~/tests-fixtures/transaction-item-category.fixture';
import { createTransactionFixture } from '~/tests-fixtures/transaction.fixture';
import { createTransactionItemFixture } from '~/tests-fixtures/transaction-item.fixture';

describe(StatisticsController.name, () => {
  const setup = setupTestingApp();
  const userFixture = beforeEachCreateUser(setup);
  const organizationFixture = beforeEachCreateOrganization(
    setup,
    userFixture.user,
  );

  beforeEach(async () => {
    await createTransactionItemCategoryFixture({
      name: 'food',
    }).saveInDB(setup.app);
    const categoryFixture = await createTransactionItemCategoryFixture({
      name: 'eating out',
    }).saveInDB(setup.app);
    const transactionFixture = await createTransactionFixture(
      userFixture.user,
      organizationFixture.organization,
    ).saveInDB(setup.app);

    await createTransactionItemFixture(
      categoryFixture.category,
      transactionFixture.transaction,
    ).saveInDB(setup.app);
  });

  describe('(GET) categories', () => {
    const createGetRequest = (query?: {
      startDate: string;
      endDate: string;
    }) => {
      if (!query) {
        return setup
          .appRequest()
          .get(
            `/organizations/${organizationFixture.organization.name}/statistics/categories`,
          );
      } else {
        return setup
          .appRequest()
          .get(
            `/organizations/${organizationFixture.organization.name}/statistics/categories?startDate=${query.startDate}&endDate=${query.endDate}`,
          );
      }
    };

    it('should return 400 when start/end dates not found in query', async () => {
      const response = await setup.withSession(userFixture, createGetRequest);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'startDate and endDate are required',
        }),
      );
    });

    it('should return 200', async () => {
      const response = await setup.withSession(userFixture, () =>
        createGetRequest({
          startDate: '2024-09-01',
          endDate: '2024-09-31',
        }),
      );

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual([
        expect.objectContaining({
          name: 'eating out',
          prevTotal: '0',
          total: '12.000000',
        }),
      ]);
    });
  });
});
