import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeSecretUniquePerNameAndOrganization1723723770811 implements MigrationInterface {
    name = 'MakeSecretUniquePerNameAndOrganization1723723770811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secret" ADD CONSTRAINT "UQ_eb1248cdfd641806f8f451f8784" UNIQUE ("name", "organizationId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secret" DROP CONSTRAINT "UQ_eb1248cdfd641806f8f451f8784"`);
    }

}
