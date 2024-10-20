import { Injectable, Logger } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  StorageClient,
  StorageUploadMetadata,
} from './interfaces/storage-client.interface';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  GetSignedUrlFailedError,
  UploadFailedError,
} from '~/modules/storage/errors/storage.error';

@Injectable()
export class S3Service implements StorageClient {
  private readonly logger = new Logger(S3Service.name);
  private readonly client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get('s3');

    this.client = new S3Client({
      region: config.region,
      credentials: {
        secretAccessKey: config.secretKey,
        accessKeyId: config.accessKey,
      },
    });
  }

  async upload(file: Buffer, metadata: StorageUploadMetadata) {
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.configService.get('s3').bucket,
          Key: metadata.key,
          ContentType: metadata.mimetype,
          Body: file,
          Metadata: {
            size: metadata.size.toString(),
            originalname: metadata.name,
            mimetype: metadata.mimetype,
          },
        }),
      );

      return { key: metadata.key };
    } catch (err) {
      this.logger.error({
        message: `Failed to upload file with key ${metadata.key}`,
        error: err,
      });
      throw new UploadFailedError(metadata.key);
    }
  }

  async getSignedUrl(key: string) {
    try {
      return await getSignedUrl(
        this.client,
        new GetObjectCommand({
          Bucket: this.configService.get('s3').bucket,
          Key: key,
        }),
        { expiresIn: 60 * 60 },
      );
    } catch (err) {
      this.logger.error({
        message: `Failed to get signed url for ${key} key`,
        error: err,
      });
      throw new GetSignedUrlFailedError(key);
    }
  }
}
