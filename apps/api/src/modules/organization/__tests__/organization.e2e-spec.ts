import { setupTestingApp } from '~/tests/setup-testing-app';
import { createOrganizationFixture } from '~/tests-fixtures/organization.fixture';
import { createUserFixture } from '~/tests-fixtures/user.fixture';
import { OrganizationController } from '../organization.controller';
import { HttpStatus } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { beforeEachCreateUser } from '~/tests/before-each-create-user';
import { itShouldReturn401, itShouldReturn404 } from '~/tests/it-should-return';
import { createSecretFixture } from '~/tests-fixtures/secret.fixture';

describe(OrganizationController.name, () => {
  const setup = setupTestingApp();

  const userFixture = beforeEachCreateUser(setup);

  describe('(GET)', () => {
    const createGetRequest = () => setup.appRequest().get('/organizations');

    itShouldReturn401('when unauthorized', createGetRequest);

    it('should return 200', async () => {
      await createOrganizationFixture().saveInDB(
        setup.app,
        userFixture.user.id,
      );

      const response = await setup.withSession(userFixture, createGetRequest);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining([
          {
            name: 'super-org',
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
        ]),
      );
    });
  });

  describe('(GET) :name', () => {
    const organizationFixture = createOrganizationFixture();

    beforeEach(async () => {
      await organizationFixture.saveInDB(setup.app, userFixture.user.id);
    });

    const createGetRequest = () =>
      setup
        .appRequest()
        .get(`/organizations/${organizationFixture.organization.name}`);

    itShouldReturn401('when unauthorized', createGetRequest);
    itShouldReturn404('when user does not belong to org', () =>
      setup.withSession(createUserFixture({ id: uuidv4() }), createGetRequest),
    );

    it('should return 200', async () => {
      const response = await setup.withSession(userFixture, createGetRequest);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'super-org',
        }),
      );
    });
  });

  describe('(POST)', () => {
    const createPostRequest = () =>
      setup.appRequest().post('/organizations').send({ name: 'NEW ORG' });

    itShouldReturn401('when unauthorized', createPostRequest);

    it('should return 201', async () => {
      const response = await setup.withSession(userFixture, createPostRequest);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'NEW ORG',
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });

    it('should return validation errors', async () => {
      const response = await setup.withSession(userFixture, () =>
        setup.appRequest().post('/organizations').send({ name: 'a' }),
      );

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response.body).toEqual({
        fieldErrors: { name: ['String must contain at least 2 character(s)'] },
        formErrors: [],
      });
    });

    it('should return 400 if org name already taken', async () => {
      await createOrganizationFixture({ name: 'NEW ORG' }).saveInDB(setup.app);

      const response = await setup.withSession(userFixture, createPostRequest);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('(GET) :name/users', () => {
    const organizationFixture = createOrganizationFixture();

    beforeEach(async () => {
      await organizationFixture.saveInDB(setup.app, userFixture.user.id);
    });

    const createGetRequest = () =>
      setup
        .appRequest()
        .get(`/organizations/${organizationFixture.organization.name}/users`);

    itShouldReturn401('when unauthorized', createGetRequest);
    itShouldReturn404('when user does not belong to org', () =>
      setup.withSession(createUserFixture({ id: uuidv4() }), createGetRequest),
    );

    it('should return 200', async () => {
      const response = await setup.withSession(userFixture, createGetRequest);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: userFixture.user.email,
          }),
        ]),
      );
    });
  });

  describe('(POST) :name/secrets', () => {
    const organizationFixture = createOrganizationFixture();

    beforeEach(async () => {
      await organizationFixture.saveInDB(setup.app, userFixture.user.id);
    });

    const createPostRequest = () =>
      setup
        .appRequest()
        .post(`/organizations/${organizationFixture.organization.name}/secrets`)
        .send({ name: 'SECRET', value: 'VALUE' });

    itShouldReturn401('when unauthorized', createPostRequest);
    itShouldReturn404('when user does not belong to org', () =>
      setup.withSession(createUserFixture({ id: uuidv4() }), createPostRequest),
    );

    it('should upsert secret in organization', async () => {
      await createSecretFixture({
        organization: organizationFixture.organization,
        name: 'SECRET',
      }).saveInDB(setup.app);
      const response = await setup.withSession(userFixture, createPostRequest);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'SECRET',
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });

  describe('(GET) :name/secrets/:secretName', () => {
    const organizationFixture = createOrganizationFixture();
    const secretFixture = createSecretFixture({
      organization: organizationFixture.organization,
    });

    beforeEach(async () => {
      await organizationFixture.saveInDB(setup.app, userFixture.user.id);
    });

    const createGetRequest = () =>
      setup
        .appRequest()
        .get(
          `/organizations/${organizationFixture.organization.name}/secrets/${secretFixture.secret.name}`,
        );

    itShouldReturn401('when unauthorized', createGetRequest);
    itShouldReturn404('when user does not belong to org', () =>
      setup.withSession(createUserFixture({ id: uuidv4() }), createGetRequest),
    );

    it('should return 200', async () => {
      await secretFixture.saveInDB(setup.app);

      const response = await setup.withSession(userFixture, createGetRequest);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: secretFixture.secret.name,
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
    });
  });
});
