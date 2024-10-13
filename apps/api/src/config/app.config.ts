import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('app', () => ({
  apiUrl: process.env.API_URL,
}));
