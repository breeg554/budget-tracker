import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeQuantityPrecision1724085236242
  implements MigrationInterface
{
  name = 'ChangeQuantityPrecision1724085236242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_item" ALTER COLUMN "quantity" TYPE numeric(10,3)`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_item" ALTER COLUMN "quantity" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction_item" ALTER COLUMN "quantity" TYPE integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_item" ALTER COLUMN "quantity" SET NOT NULL`,
    );
  }
}
