import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '~/modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtGuard } from '~/modules/auth/jwt.guard';
import { JwtStrategy } from '~/modules/auth/jwt.strategy';
import { LoggerModule } from 'nestjs-pino';
import { CustomZodValidationPipe } from '~/modules/errors/zodValidationPipe';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';
import { DBConfig } from '~/config';

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
    LoggerModule.forRoot(),
    AuthModule,
    OrganizationModule,
    TransactionModule,
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
