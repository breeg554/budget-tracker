import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '~/modules/auth/auth.module';
import { User } from '~/entities/user/user.entity';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtGuard } from '~/modules/auth/jwt.guard';
import { JwtStrategy } from '~/modules/auth/jwt.strategy';
import { LoggerModule } from 'nestjs-pino';
import { CustomZodValidationPipe } from '~/modules/errors/zodValidationPipe';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { Transaction } from '~/entities/transaction/transaction.entity';
import { Organization } from '~/entities/organization/organization.entity';
import { OrganizationModule } from '~/modules/organization/organization.module';
import { TransactionModule } from '~/modules/organization/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    LoggerModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: process.env.DATABASE_PORT as unknown as number,
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Organization,
        Transaction,
        TransactionItem,
        TransactionItemCategory,
      ],
      synchronize: true,
      logging: true,
    }),
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
