import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedDateToTransactionItem1725382142584 implements MigrationInterface {
    name = 'AddDeletedDateToTransactionItem1725382142584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_item" ADD "deletedDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_item" DROP COLUMN "deletedDate"`);
    }

}
