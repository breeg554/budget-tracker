import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKeyToReceipt1729417725553 implements MigrationInterface {
    name = 'AddKeyToReceipt1729417725553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD "key" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD "originalName" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "originalName"`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "key"`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD "content" text NOT NULL`);
    }

}
