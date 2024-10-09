import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('queue', () => ({
  username: process.env.BULL_BOARD_USERNAME,
  password: process.env.BULL_BOARD_PASSWORD,
}));
