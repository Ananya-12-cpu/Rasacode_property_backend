import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1770052685650 implements MigrationInterface {
  name = 'SchemaUpdate1770052685650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const colExists = await queryRunner.query(
      `SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Roles' AND COLUMN_NAME = 'organization_id'`,
    );
    if (colExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "Roles" ADD "organization_id" uniqueidentifier`,
      );
    }

    const fkExists = await queryRunner.query(
      `SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_2909321a16bc558f799b3e0841e'`,
    );
    if (fkExists.length === 0) {
      await queryRunner.query(
        `ALTER TABLE "Roles" ADD CONSTRAINT "FK_2909321a16bc558f799b3e0841e" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Roles" DROP CONSTRAINT "FK_2909321a16bc558f799b3e0841e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Roles" DROP COLUMN "organization_id"`,
    );
  }
}
