import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseCleaner {
  constructor(private dataSource: DataSource) {}

  public async cleanup() {
    const connection = this.dataSource.manager.connection;

    if (!connection.isInitialized) {
      await connection.initialize();
    }
    const tables = connection.entityMetadatas
      .filter((metadata) => metadata.tableType === 'regular')
      .map((metadata) => {
        if (metadata.schema) {
          return `${metadata.schema}.${metadata.tableName}`;
        }
        return `"${metadata.tableName}"`;
      });

    await connection.query(
      `TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE;`,
    );
  }
}
