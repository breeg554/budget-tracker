import { registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('s3', () => ({
  region: process.env.AWS_S3_REGION,
  accessKey: process.env.AWS_S3_ACCESS_KEY,
  secretKey: process.env.AWS_S3_SECRET_KEY,
  bucket: process.env.AWS_S3_BUCKET,
}));
