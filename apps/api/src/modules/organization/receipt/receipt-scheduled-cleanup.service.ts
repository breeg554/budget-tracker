import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

export class ReceiptScheduledCleanupService {
  private readonly receiptsDirectoryPath = path.join(
    process.cwd(),
    '/tmp/receipts',
  );

  @Cron(CronExpression.EVERY_HOUR)
  public cleanUpReceipts() {
    fs.readdir(this.receiptsDirectoryPath, (err, files) => {
      if (err) return console.error('Error reading directory');

      files.forEach((file) => {
        fs.stat(this.getFilePath(file), (err, fileStat) => {
          if (err) {
            return console.error(
              `Error reading file ${this.getFilePath(file)} stats`,
            );
          }

          if (!fileStat.isFile()) return;

          if (new Date().getTime() - fileStat.mtime.getTime() > 60 * 1000) {
            fs.unlink(this.getFilePath(file), (err) =>
              console.error(
                `Error deleting file ${this.getFilePath(file)}`,
                err,
              ),
            );
          }
        });
      });
    });
  }

  private getFilePath(fileName: string) {
    return path.join(this.receiptsDirectoryPath, fileName);
  }
}
