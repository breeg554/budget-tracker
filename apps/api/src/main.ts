import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as process from 'process';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('/api');
  app.use(cookieParser());

  app.useStaticAssets(path.join(process.cwd(), '/tmp/receipts'), {
    prefix: '/tmp',
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
