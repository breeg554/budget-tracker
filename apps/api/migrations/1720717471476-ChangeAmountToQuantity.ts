import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAmountToQuantity1720717471476 implements MigrationInterface {
    name = 'ChangeAmountToQuantity1720717471476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_item" RENAME COLUMN "amount" TO "quantity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_item" RENAME COLUMN "quantity" TO "amount"`);
    }

}
