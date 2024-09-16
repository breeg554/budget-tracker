import { ConfigService } from '@nestjs/config';
import * as process from 'process';

export const typeormDatabaseOptionsFactory = (configService: ConfigService) => {
  const baseConfig = configService.get('database');

  const database =
    configService.get('NODE_ENV') === 'test'
      ? `${baseConfig.database}_${process.env.JEST_WORKER_ID}`
      : baseConfig.database;

  return { ...baseConfig, database };
};
