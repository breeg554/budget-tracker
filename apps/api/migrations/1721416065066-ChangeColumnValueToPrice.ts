import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnValueToPrice1721416065066 implements MigrationInterface {
    name = 'ChangeColumnValueToPrice1721416065066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_item" RENAME COLUMN "value" TO "price"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_item" RENAME COLUMN "price" TO "value"`);
    }

}
