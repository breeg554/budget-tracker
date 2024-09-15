import * as request from 'supertest';

import { DataSource } from 'typeorm';
import { SetupTestingApp } from 'test/setup-testing-app';
import { TransactionItemCategoryController } from '../transaction-item-category.controller';

describe(TransactionItemCategoryController.name, () => {
  const setup = new SetupTestingApp();

  beforeAll(async () => {
    await setup.init();
  });

  beforeEach(async () => {
    const dataSource = setup.app.get(DataSource);

    if (dataSource.isInitialized) {
      await dataSource.dropDatabase();
      await dataSource.runMigrations();
    }
  });

  afterAll(async () => {
    const dataSource = setup.app.get(DataSource);

    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    await setup.close();
  });

  describe('(POST)', () => {
    const createPostRequest = () =>
      request(setup.app.getHttpServer())
        .post('/transaction-item-categories')
        .send({ name: 'test' });

    it('should return 201', async () => {
      const response = await createPostRequest();

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({ name: 'test', id: expect.any(String) }),
      );
    });
  });

  describe('(GET)', () => {
    const createGetRequest = () =>
      request(setup.app.getHttpServer()).get('/transaction-item-categories');

    it('should return 200', async () => {
      const response = await createGetRequest();

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
