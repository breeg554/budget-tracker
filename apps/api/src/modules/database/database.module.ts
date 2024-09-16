import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeormDatabaseOptionsFactory } from './typeorm-database-options.factory';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeormDatabaseOptionsFactory,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
