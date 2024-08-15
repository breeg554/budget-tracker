import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReceiptTable1723284344777 implements MigrationInterface {
    name = 'AddReceiptTable1723284344777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "receipt" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" uuid, "authorId" uuid, CONSTRAINT "PK_b4b9ec7d164235fbba023da9832" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD CONSTRAINT "FK_9ad5d1ada74cacafccf526d376e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receipt" ADD CONSTRAINT "FK_3ea19dd639ff1a9e891ea7a0f41" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipt" DROP CONSTRAINT "FK_3ea19dd639ff1a9e891ea7a0f41"`);
        await queryRunner.query(`ALTER TABLE "receipt" DROP CONSTRAINT "FK_9ad5d1ada74cacafccf526d376e"`);
        await queryRunner.query(`DROP TABLE "receipt"`);
    }

}
