import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  public getDiskStorage() {
    return diskStorage({
      destination: function (_req, _file, cb) {
        const dest = path.join(process.cwd(), '/tmp/receipts');

        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        cb(null, dest);
      },
      filename: function (_req, file, cb) {
        cb(null, `${Date.now()}-${crypto.randomUUID()}-${file.originalname}`);
      },
    });
  }

  public removeFile(fileName: string) {
    fs.unlinkSync(this.getFilePath(fileName));
  }

  public getFilePath(fileName: string) {
    return path.join(process.cwd(), '/tmp/receipts', fileName);
  }

  public getFileUrl(fileName: string) {
    return `${process.env.API_URL}/tmp/${fileName}`;
  }
}

export function createDiscFileStorage() {
  return new FileService();
}
