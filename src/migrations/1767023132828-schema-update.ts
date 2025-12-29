import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1767023132828 implements MigrationInterface {
    name = 'SchemaUpdate1767023132828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "zip_code" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "DF_4915046e5cbff930085ebdf8493"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "DF_4915046e5cbff930085ebdf8493" DEFAULT getdate() FOR "created_at"`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "updated_at" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "DF_dd0008be5df9ed6976a94ce9491"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "DF_dd0008be5df9ed6976a94ce9491" DEFAULT getdate() FOR "updated_at"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "UQ_property_address" UNIQUE ("street_address", "unit_apt", "city", "state", "zip_code")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "UQ_property_address"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "DF_dd0008be5df9ed6976a94ce9491"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "DF_dd0008be5df9ed6976a94ce9491" DEFAULT sysdatetime() FOR "updated_at"`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "updated_at" datetime2 NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "DF_4915046e5cbff930085ebdf8493"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "DF_4915046e5cbff930085ebdf8493" DEFAULT sysdatetime() FOR "created_at"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "zip_code" nvarchar(50)`);
    }

}
