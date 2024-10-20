import { Injectable, Logger } from '@nestjs/common';

import {
  StorageClient,
  StorageUploadMetadata,
} from './interfaces/storage-client.interface';
import {
  GetSignedUrlFailedError,
  UploadFailedError,
} from '~/modules/storage/errors/storage.error';
import * as fs from 'fs';
import * as path from 'path';
import { CreateDirectoryFailedError } from '~/modules/storage/errors/local-storage.error';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStorageService implements StorageClient {
  private readonly logger = new Logger(LocalStorageService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async upload(file: Buffer, metadata: StorageUploadMetadata) {
    try {
      this.createDirectoryIfNotExists(this.getDirectoryPath(metadata.key));

      fs.writeFileSync(this.getFilePath(metadata.key), file);

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
      return `${this.getTemporaryFileUrl(key)}?token=${this.jwtService.sign({ key })}`;
    } catch (err) {
      this.logger.error({
        message: `Failed to get signed url for ${key} key`,
        error: err,
      });
      throw new GetSignedUrlFailedError(key);
    }
  }

  public getFilePath(key: string) {
    return path.join(process.cwd(), '/tmp/receipts/', key);
  }

  private createDirectoryIfNotExists(path: string) {
    try {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
      }
    } catch (err) {
      this.logger.error({
        message: `Failed to create directory ${path}`,
        error: err,
      });
      throw new CreateDirectoryFailedError(path);
    }
  }

  private getDirectoryPath(key: string) {
    return path.dirname(this.getFilePath(key));
  }

  private getTemporaryFileUrl(key: string) {
    const { apiUrl } = this.configService.get('app');

    return `${apiUrl}/api/temporary/receipts/${key}`;
  }
}
