import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSecretTable1723236169778 implements MigrationInterface {
    name = 'AddSecretTable1723236169778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "secret" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" uuid, CONSTRAINT "UQ_f05861f3e072021bda08543eb4c" UNIQUE ("name"), CONSTRAINT "PK_6afa4961954e17ec2d6401afc3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "secret" ADD CONSTRAINT "FK_039b9bfe2df4ba75dbff6053772" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "secret" DROP CONSTRAINT "FK_039b9bfe2df4ba75dbff6053772"`);
        await queryRunner.query(`DROP TABLE "secret"`);
    }

}
