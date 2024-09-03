import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedDateToTransaction1725381993928 implements MigrationInterface {
    name = 'AddDeletedDateToTransaction1725381993928'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "deletedDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "deletedDate"`);
    }

}
