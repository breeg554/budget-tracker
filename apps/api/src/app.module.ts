import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '~/modules/user/user.module';
import { AuthModule } from '~/modules/auth/auth.module';
import { User } from '~/entities/user/user.entity';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { JwtGuard } from '~/modules/auth/jwt.guard';
import { JwtStrategy } from '~/modules/auth/jwt.strategy';
import { LoggerModule } from 'nestjs-pino';
import { CustomZodValidationPipe } from '~/modules/errors/zodValidationPipe';
import { TransactionModule } from '~/modules/transaction/transaction.module';
import { TransactionItem } from '~/entities/transaction/transactionItem.entity';
import { TransactionItemCategory } from '~/entities/transaction/transactionItemCategory.entity';
import { Transaction } from '~/entities/transaction/transaction.entity';

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
      entities: [User, Transaction, TransactionItem, TransactionItemCategory],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
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
