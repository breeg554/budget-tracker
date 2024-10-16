import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthenticatedSocketIoAdapter } from '~/modules/gateways/auth-socket-io.adapter';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('/api');
  app.use(cookieParser());
  app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app));

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
