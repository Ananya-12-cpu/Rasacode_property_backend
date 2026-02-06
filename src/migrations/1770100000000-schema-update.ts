import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1770100000000 implements MigrationInterface {
  name = 'SchemaUpdate1770100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop the existing global unique constraint on Roles.Name
    const uqExists = await queryRunner.query(
      `SELECT 1 FROM sys.indexes WHERE name = 'UQ_ad152fb549a5b88dccaaf3a1013' AND object_id = OBJECT_ID('Roles')`,
    );
    if (uqExists.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "Roles" DROP CONSTRAINT "UQ_ad152fb549a5b88dccaaf3a1013"`,
      );
    }

    // Create filtered unique index for org-scoped roles (Name unique per organization)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_role_name_per_org" ON "dbo"."Roles" ("Name", "organization_id") WHERE "organization_id" IS NOT NULL`,
    );

    // Create filtered unique index for system/global roles (Name unique when no organization)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_role_name_global" ON "dbo"."Roles" ("Name") WHERE "organization_id" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the filtered indexes
    await queryRunner.query(
      `DROP INDEX "UQ_role_name_per_org" ON "dbo"."Roles"`,
    );
    await queryRunner.query(
      `DROP INDEX "UQ_role_name_global" ON "dbo"."Roles"`,
    );

    // Restore the original global unique constraint
    await queryRunner.query(
      `ALTER TABLE "Roles" ADD CONSTRAINT "UQ_ad152fb549a5b88dccaaf3a1013" UNIQUE ("Name")`,
    );
  }
}
