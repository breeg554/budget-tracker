import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { RouterModule } from '~/modules/router/router.module';

import { LoggerModule } from 'nestjs-pino';
import {
  AppConfig,
  DBConfig,
  QueueConfig,
  RedisConfig,
  S3Config,
} from '~/config';
import { AuthModule } from '~/modules/auth/auth.module';
import { JwtGuard } from '~/modules/auth/jwt.guard';
import { JwtStrategy } from '~/modules/auth/jwt.strategy';
import { CustomZodValidationPipe } from '~/modules/errors/zodValidationPipe';
import { OrganizationModule } from '~/modules/organization/organization.module';

import { TransactionModule } from '~/modules/organization/transaction/transaction.module';
import { TransactionItemModule } from '~/modules/organization/transaction/transaction-item/transaction-item.module';
import { SecretModule } from '~/modules/organization/secret/secret.module';
import { ReceiptModule } from '~/modules/organization/receipt/receipt.module';
import { StatisticsModule } from '~/modules/organization/statistics/statistics.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UserModule } from '~/modules/user/user.module';
import { AppController } from './app.controller';
import { DatabaseModule } from '~/modules/database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueModule } from '~/modules/queue/queue.module';
import { StorageModule } from '~/modules/storage/storage.module';
import { TemporaryFilesModule } from '~/modules/temporary/temporary-files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [DBConfig, RedisConfig, QueueConfig, AppConfig, S3Config],
    }),
    DatabaseModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redis = configService.get('redis');

        return {
          store: redisStore,
          url: redis.url,
          ttl: redis.ttl,
          password: redis.password,
        };
      },
    }),
    QueueModule,
    LoggerModule.forRoot({
      pinoHttp: {
        redact: {
          paths: [
            'req.headers.cookie',
            'req.headers.authorization',
            'req.headers["set-cookie"]',
            'req.headers["x-api-key"]',
          ],
          remove: true,
        },
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: true,
            ignore: 'pid,hostname',
          },
        },
      },
    }),
    StorageModule,
    RouterModule,
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    OrganizationModule,
    TransactionModule,
    TransactionItemModule,
    StatisticsModule,
    SecretModule,
    ReceiptModule,
    TemporaryFilesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
