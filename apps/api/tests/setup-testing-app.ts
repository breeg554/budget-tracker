import { INestApplication } from '@nestjs/common';
import { Maybe } from '~/utils/ts-utils';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '~/app.module';
import { DatabaseCleaner } from './database-cleaner';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AuthService } from '~/modules/auth/auth.service';
import { UserFixture } from '~/tests-fixtures/user.fixture';
import supertest from 'supertest';

export class SetupTestingApp {
  private _app: Maybe<INestApplication>;

  constructor() {}

  public async init() {
    if (this._app) return this;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseCleaner],
    }).compile();

    this._app = moduleFixture.createNestApplication();

    this._app.use(cookieParser());

    await this._app.init();

    return this;
  }

  public async close() {
    if (!this._app) throw new Error('App is not initialized');

    await this.cleanup();
    await this._app.close();
  }

  public async cleanup() {
    if (!this._app) throw new Error('App is not initialized');

    const dbCleaner = this._app.get(DatabaseCleaner);
    await dbCleaner.cleanup();

    return this;
  }

  get app() {
    return this._app;
  }

  appRequest() {
    return request(this.app.getHttpServer());
  }

  withSession(fixture: UserFixture, request: () => supertest.Test) {
    const authService = this.app.get(AuthService);

    const token = authService.generateAccessToken(fixture.user);

    return request().set('Cookie', `access_token=${token}`);
  }
}

export const setupTestingApp = () => {
  const setup = new SetupTestingApp();

  beforeAll(async () => {
    await setup.init();
  });

  afterEach(async () => {
    await setup.cleanup();
  });

  afterAll(async () => {
    await setup.close();
  });

  return setup;
};
