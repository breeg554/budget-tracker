import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('redis', () => ({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
  ttl: process.env.REDIS_TTL,
}));
