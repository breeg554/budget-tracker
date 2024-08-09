import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueConstraint1723237462037 implements MigrationInterface {
    name = 'RemoveUniqueConstraint1723237462037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secret" DROP CONSTRAINT "UQ_f05861f3e072021bda08543eb4c"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secret" ADD CONSTRAINT "UQ_f05861f3e072021bda08543eb4c" UNIQUE ("name")`);
    }

}
