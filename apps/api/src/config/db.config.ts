import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT as unknown as number,
  password: process.env.DATABASE_PASSWORD,
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_NAME,
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  synchronize: false,
}));
