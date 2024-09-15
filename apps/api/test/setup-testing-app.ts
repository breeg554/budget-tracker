import { INestApplication } from '@nestjs/common';
import { Maybe } from '~/utils/ts-utils';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '~/app.module';

export class SetupTestingApp {
  private _app: Maybe<INestApplication>;

  constructor() {}

  public async init() {
    if (this._app) return this;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this._app = moduleFixture.createNestApplication();

    await this._app.init();

    return this;
  }

  public async close() {
    if (this._app === null) throw new Error('App is not initialized');

    await this._app.close();
  }

  get app() {
    return this._app;
  }
}
