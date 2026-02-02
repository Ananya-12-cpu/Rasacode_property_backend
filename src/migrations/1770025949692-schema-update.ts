import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1770025949692 implements MigrationInterface {
    name = 'SchemaUpdate1770025949692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "organization_id" uniqueidentifier`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_bf95e9cc1a46684dc8f40f2a925" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_bf95e9cc1a46684dc8f40f2a925"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "organization_id"`);
    }

}
