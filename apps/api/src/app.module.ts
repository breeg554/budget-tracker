import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '~/modules/router/router.module';

import { LoggerModule } from 'nestjs-pino';
import { DBConfig, RedisConfig } from '~/config';
import { AuthModule } from '~/modules/auth/auth.module';
import { JwtGuard } from '~/modules/auth/jwt.guard';
import { JwtStrategy } from '~/modules/auth/jwt.strategy';
import { CustomZodValidationPipe } from '~/modules/errors/zodValidationPipe';
import { OrganizationModule } from '~/modules/organization/organization.module';

import { TransactionModule } from '~/modules/organization/transaction/transaction.module';
import { AppController } from './app.controller';
import { SecretModule } from '~/modules/organization/secret/secret.module';
import { ReceiptModule } from '~/modules/organization/receipt/receipt.module';
import { StatisticsModule } from '~/modules/organization/statistics/statistics.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [DBConfig, RedisConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redis = configService.get('redis');

        return {
          store: redisStore,
          url: redis.url,
          ttl: redis.ttl,
          password: redis.password,
        };
      },
      inject: [ConfigService],
    }),
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
    RouterModule,

    AuthModule,
    UserModule,
    OrganizationModule,
    TransactionModule,
    StatisticsModule,
    SecretModule,
    ReceiptModule,
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
