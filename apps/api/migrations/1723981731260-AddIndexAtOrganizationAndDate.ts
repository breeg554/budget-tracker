import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexAtOrganizationAndDate1723981731260 implements MigrationInterface {
    name = 'AddIndexAtOrganizationAndDate1723981731260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_8ce65696bc138d3cd182f65317" ON "transaction" ("organizationId", "date") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_8ce65696bc138d3cd182f65317"`);
    }

}
