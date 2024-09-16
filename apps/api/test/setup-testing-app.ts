import { INestApplication } from '@nestjs/common';
import { Maybe } from '~/utils/ts-utils';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '~/app.module';
import { DatabaseCleaner } from './database-cleaner';

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

    await this._app.init();

    return this;
  }

  public async close() {
    if (!this._app) throw new Error('App is not initialized');

    await this.cleanup();
    await this._app.close();
  }
  //run tests rum
  public async cleanup() {
    if (!this._app) throw new Error('App is not initialized');

    const dbCleaner = this._app.get(DatabaseCleaner);
    await dbCleaner.cleanup();

    return this;
  }

  get app() {
    return this._app;
  }
}
