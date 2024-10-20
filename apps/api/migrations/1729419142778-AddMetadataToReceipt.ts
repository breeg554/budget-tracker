import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMetadataToReceipt1729419142778 implements MigrationInterface {
    name = 'AddMetadataToReceipt1729419142778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" ADD "mimeType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD "size" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP COLUMN "mimeType"`);
    }

}
