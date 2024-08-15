import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { DBConfig } from '~/config';
import { AuthModule } from '~/modules/auth/auth.module';
import { JwtGuard } from '~/modules/auth/jwt.guard';
import { JwtStrategy } from '~/modules/auth/jwt.strategy';
import { CustomZodValidationPipe } from '~/modules/errors/zodValidationPipe';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SecretModule } from '~/modules/organization/secret/secret.module';
import { ReceiptModule } from '~/modules/organization/receipt/receipt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [DBConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    AuthModule,
    OrganizationModule,
    TransactionModule,
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
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
