import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: configService.get('DATABASE_PORT'),
  password: configService.get('DATABASE_PASSWORD'),
  username: configService.get('DATABASE_USERNAME'),
  database: configService.get('DATABASE_NAME'),
  logging: configService.get('NODE_ENV') === 'development',
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  synchronize: false,
});
