import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT as unknown as number,
  ttl: process.env.REDIS_TTL as unknown as number,
}));
