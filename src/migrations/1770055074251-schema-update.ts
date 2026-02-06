import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1770055074251 implements MigrationInterface {
    name = 'SchemaUpdate1770055074251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Plans" ADD "organization_id" uniqueidentifier`);
        await queryRunner.query(`ALTER TABLE "Plans" ADD CONSTRAINT "FK_52be572642b896f25cec2454284" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Plans" DROP CONSTRAINT "FK_52be572642b896f25cec2454284"`);
        await queryRunner.query(`ALTER TABLE "Plans" DROP COLUMN "organization_id"`);
    }

}
