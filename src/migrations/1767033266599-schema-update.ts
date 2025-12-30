import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1767033266599 implements MigrationInterface {
    name = 'SchemaUpdate1767033266599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ADD "deleted_at" datetime`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "deleted_at"`);
    }

}
