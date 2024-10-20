import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { LocalStorageService } from '~/modules/storage/local-storage.service';
import { TemporaryReceiptNotFoundError } from '~/modules/temporary/errors/temporary-receipts.error';

@Injectable()
export class TemporaryReceiptsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly localStorageService: LocalStorageService,
  ) {}

  public getReceiptPath(token: string) {
    try {
      const { key } = this.jwtService.verify<{ key: string }>(token);

      if (fs.existsSync(this.localStorageService.getFilePath(key))) {
        return this.localStorageService.getFilePath(key);
      } else {
        throw new TemporaryReceiptNotFoundError();
      }
    } catch (err) {
      throw new TemporaryReceiptNotFoundError();
    }
  }
}
