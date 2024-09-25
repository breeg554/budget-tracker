import { HttpStatus } from '@nestjs/common';
import { setupTestingApp } from '~/tests/setup-testing-app';
import { beforeEachCreateUser } from '~/tests/before-each-create-user';
import { beforeEachCreateOrganization } from '~/tests/before-each-create-organization';
import { StatisticsController } from '../statistics.controller';
import { createTransactionItemCategoryFixture } from '~/tests-fixtures/transaction-item-category.fixture';
import { createTransactionFixture } from '~/tests-fixtures/transaction.fixture';
import { createTransactionItemFixture } from '~/tests-fixtures/transaction-item.fixture';
import { endOfMonth, startOfMonth } from 'date-fns';

describe(StatisticsController.name, () => {
  const setup = setupTestingApp();
  const userFixture = beforeEachCreateUser(setup);
  const organizationFixture = beforeEachCreateOrganization(
    setup,
    userFixture.user,
  );

  beforeEach(async () => {
    const categoryFixtureOne = await createTransactionItemCategoryFixture()
      .withName('alcohol')
      .saveInDB(setup.app);
    const categoryFixtureTwo = await createTransactionItemCategoryFixture()
      .withName('eating out')
      .saveInDB(setup.app);

    const transactionFixture = await createTransactionFixture(
      userFixture.user,
      organizationFixture.organization,
    ).saveInDB(setup.app);

    await createTransactionItemFixture(
      categoryFixtureOne.category,
      transactionFixture.transaction,
    )
      .withQuantity(2)
      .saveInDB(setup.app);

    await createTransactionItemFixture(
      categoryFixtureTwo.category,
      transactionFixture.transaction,
    )
      .withPrice(1.15)
      .saveInDB(setup.app);
  });

  describe('(GET) categories', () => {
    const createGetRequest = (query: { startDate: string; endDate: string }) =>
      setup
        .appRequest()
        .get(
          `/organizations/${organizationFixture.organization.name}/statistics/categories`,
        )
        .query(query);

    it('should return 400 when start/end dates not found in query', async () => {
      const response = await setup.withSession(userFixture, () =>
        setup
          .appRequest()
          .get(
            `/organizations/${organizationFixture.organization.name}/statistics/categories`,
          ),
      );

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'startDate and endDate are required',
        }),
      );
    });

    it('should return monthly statistics', async () => {
      const response = await setup.withSession(userFixture, () =>
        createGetRequest({
          startDate: startOfMonth(new Date()).toISOString(),
          endDate: endOfMonth(new Date()).toISOString(),
        }),
      );

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'alcohol',
            prevTotal: '0',
            total: '24.000000',
          }),
          expect.objectContaining({
            name: 'eating out',
            prevTotal: '0',
            total: '1.150000',
          }),
        ]),
      );
    });
  });
});
