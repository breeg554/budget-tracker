import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinColumnToSessionUser1721235465472 implements MigrationInterface {
    name = 'AddJoinColumnToSessionUser1721235465472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "UQ_3d2f174ef04fb312fdebd0ddc53" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "UQ_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "userId"`);
    }

}
