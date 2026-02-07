import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrgIdToInt1770500000000 implements MigrationInterface {
  name = 'OrgIdToInt1770500000000';

  /**
   * Helper: drop ALL objects that depend on a specific column in a table.
   * This includes foreign keys, indexes, default constraints, check constraints,
   * unique constraints, and statistics (both user-created and auto-created).
   */
  private async dropAllColumnDependencies(
    queryRunner: QueryRunner,
    schema: string,
    tableName: string,
    columnName: string,
  ): Promise<void> {
    const fullTable = `${schema}.${tableName}`;

    // 1. Drop foreign keys that reference this column (as parent)
    const fks = await queryRunner.query(
      `SELECT fk.name AS constraint_name
       FROM sys.foreign_keys fk
       JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
       JOIN sys.columns c ON fkc.parent_column_id = c.column_id AND fkc.parent_object_id = c.object_id
       WHERE fk.parent_object_id = OBJECT_ID('${fullTable}')
         AND c.name = '${columnName}'`,
    );
    for (const fk of fks) {
      await queryRunner.query(
        `ALTER TABLE "${schema}"."${tableName}" DROP CONSTRAINT "${fk.constraint_name}"`,
      );
    }

    // 2. Drop foreign keys from OTHER tables that reference this column
    const referencingFks = await queryRunner.query(
      `SELECT fk.name AS constraint_name, OBJECT_SCHEMA_NAME(fk.parent_object_id) AS parent_schema, OBJECT_NAME(fk.parent_object_id) AS parent_table
       FROM sys.foreign_keys fk
       JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
       JOIN sys.columns c ON fkc.referenced_column_id = c.column_id AND fkc.referenced_object_id = c.object_id
       WHERE fk.referenced_object_id = OBJECT_ID('${fullTable}')
         AND c.name = '${columnName}'`,
    );
    for (const fk of referencingFks) {
      await queryRunner.query(
        `ALTER TABLE "${fk.parent_schema}"."${fk.parent_table}" DROP CONSTRAINT "${fk.constraint_name}"`,
      );
    }

    // 3. Drop all indexes that include this column (non-PK)
    const indexes = await queryRunner.query(
      `SELECT DISTINCT i.name AS index_name
       FROM sys.indexes i
       JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
       JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
       WHERE i.object_id = OBJECT_ID('${fullTable}')
         AND c.name = '${columnName}'
         AND i.is_primary_key = 0
         AND i.is_unique_constraint = 0
         AND i.name IS NOT NULL`,
    );
    for (const idx of indexes) {
      await queryRunner.query(
        `DROP INDEX "${idx.index_name}" ON "${schema}"."${tableName}"`,
      );
    }

    // 4. Drop unique constraints that include this column
    const uniqueConstraints = await queryRunner.query(
      `SELECT i.name AS constraint_name
       FROM sys.indexes i
       JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
       JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
       WHERE i.object_id = OBJECT_ID('${fullTable}')
         AND c.name = '${columnName}'
         AND i.is_unique_constraint = 1`,
    );
    for (const uc of uniqueConstraints) {
      await queryRunner.query(
        `ALTER TABLE "${schema}"."${tableName}" DROP CONSTRAINT "${uc.constraint_name}"`,
      );
    }

    // 5. Drop primary key if it involves this column
    const pks = await queryRunner.query(
      `SELECT kc.name AS constraint_name
       FROM sys.key_constraints kc
       JOIN sys.index_columns ic ON kc.parent_object_id = ic.object_id AND kc.unique_index_id = ic.index_id
       JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
       WHERE kc.parent_object_id = OBJECT_ID('${fullTable}')
         AND kc.type = 'PK'
         AND c.name = '${columnName}'`,
    );
    for (const pk of pks) {
      await queryRunner.query(
        `ALTER TABLE "${schema}"."${tableName}" DROP CONSTRAINT "${pk.constraint_name}"`,
      );
    }

    // 6. Drop default constraints on this column
    const defaults = await queryRunner.query(
      `SELECT dc.name AS constraint_name
       FROM sys.default_constraints dc
       JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
       WHERE dc.parent_object_id = OBJECT_ID('${fullTable}')
         AND c.name = '${columnName}'`,
    );
    for (const df of defaults) {
      await queryRunner.query(
        `ALTER TABLE "${schema}"."${tableName}" DROP CONSTRAINT "${df.constraint_name}"`,
      );
    }

    // 7. Drop check constraints on this column
    const checks = await queryRunner.query(
      `SELECT cc.name AS constraint_name
       FROM sys.check_constraints cc
       JOIN sys.columns c ON cc.parent_object_id = c.object_id AND cc.parent_column_id = c.column_id
       WHERE cc.parent_object_id = OBJECT_ID('${fullTable}')
         AND c.name = '${columnName}'`,
    );
    for (const ck of checks) {
      await queryRunner.query(
        `ALTER TABLE "${schema}"."${tableName}" DROP CONSTRAINT "${ck.constraint_name}"`,
      );
    }

    // 8. Drop ALL statistics on this column (including auto-created)
    const stats = await queryRunner.query(
      `SELECT s.name AS stat_name
       FROM sys.stats s
       JOIN sys.stats_columns sc ON s.object_id = sc.object_id AND s.stats_id = sc.stats_id
       JOIN sys.columns c ON sc.object_id = c.object_id AND sc.column_id = c.column_id
       WHERE s.object_id = OBJECT_ID('${fullTable}')
         AND c.name = '${columnName}'
         AND s.name NOT LIKE '_WA_Sys_%'`,
    );
    for (const stat of stats) {
      await queryRunner.query(
        `DROP STATISTICS "${schema}"."${tableName}"."${stat.stat_name}"`,
      );
    }

    // 9. Drop auto-created statistics (_WA_Sys_ prefixed) - these need special handling
    const autoStats = await queryRunner.query(
      `SELECT s.name AS stat_name
       FROM sys.stats s
       JOIN sys.stats_columns sc ON s.object_id = sc.object_id AND s.stats_id = sc.stats_id
       JOIN sys.columns c ON sc.object_id = c.object_id AND sc.column_id = c.column_id
       WHERE s.object_id = OBJECT_ID('${fullTable}')
         AND c.name = '${columnName}'
         AND s.auto_created = 1`,
    );
    for (const stat of autoStats) {
      await queryRunner.query(
        `DROP STATISTICS "${schema}"."${tableName}"."${stat.stat_name}"`,
      );
    }
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop filtered indexes on Roles that reference organization_id
    await queryRunner.query(
      `IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_role_name_per_org' AND object_id = OBJECT_ID('dbo.Roles'))
       DROP INDEX "UQ_role_name_per_org" ON "dbo"."Roles"`,
    );
    await queryRunner.query(
      `IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_role_name_global' AND object_id = OBJECT_ID('dbo.Roles'))
       DROP INDEX "UQ_role_name_global" ON "dbo"."Roles"`,
    );

    // Drop ALL dependencies on organizations.id
    await this.dropAllColumnDependencies(queryRunner, 'dbo', 'organizations', 'id');

    // Drop ALL dependencies on organization_id in referencing tables
    await this.dropAllColumnDependencies(queryRunner, 'dbo', 'Users', 'organization_id');
    await this.dropAllColumnDependencies(queryRunner, 'dbo', 'Roles', 'organization_id');
    await this.dropAllColumnDependencies(queryRunner, 'dbo', 'Plans', 'organization_id');

    // Drop and recreate the id column as int identity
    await queryRunner.query(
      `ALTER TABLE "dbo"."organizations" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."organizations" ADD "id" int IDENTITY(1,1) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."organizations" ADD CONSTRAINT "PK_organizations" PRIMARY KEY ("id")`,
    );

    // Drop and recreate organization_id columns as int in referencing tables
    await queryRunner.query(
      `ALTER TABLE "dbo"."Users" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Users" ADD "organization_id" int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "dbo"."Roles" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Roles" ADD "organization_id" int NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "dbo"."Plans" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Plans" ADD "organization_id" int NULL`,
    );

    // Re-add foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "dbo"."Users" ADD CONSTRAINT "FK_Users_organization_id" FOREIGN KEY ("organization_id") REFERENCES "dbo"."organizations"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Roles" ADD CONSTRAINT "FK_Roles_organization_id" FOREIGN KEY ("organization_id") REFERENCES "dbo"."organizations"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Plans" ADD CONSTRAINT "FK_Plans_organization_id" FOREIGN KEY ("organization_id") REFERENCES "dbo"."organizations"("id") ON DELETE NO ACTION`,
    );

    // Re-create filtered unique indexes on Roles
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_role_name_per_org" ON "dbo"."Roles" ("Name", "organization_id") WHERE "organization_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_role_name_global" ON "dbo"."Roles" ("Name") WHERE "organization_id" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop filtered indexes
    await queryRunner.query(
      `IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_role_name_per_org' AND object_id = OBJECT_ID('dbo.Roles'))
       DROP INDEX "UQ_role_name_per_org" ON "dbo"."Roles"`,
    );
    await queryRunner.query(
      `IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UQ_role_name_global' AND object_id = OBJECT_ID('dbo.Roles'))
       DROP INDEX "UQ_role_name_global" ON "dbo"."Roles"`,
    );

    // Drop ALL dependencies
    await this.dropAllColumnDependencies(queryRunner, 'dbo', 'organizations', 'id');
    await this.dropAllColumnDependencies(queryRunner, 'dbo', 'Users', 'organization_id');
    await this.dropAllColumnDependencies(queryRunner, 'dbo', 'Roles', 'organization_id');
    await this.dropAllColumnDependencies(queryRunner, 'dbo', 'Plans', 'organization_id');

    // Drop and recreate as uuid
    await queryRunner.query(
      `ALTER TABLE "dbo"."Users" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Users" ADD "organization_id" uniqueidentifier NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "dbo"."Roles" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Roles" ADD "organization_id" uniqueidentifier NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "dbo"."Plans" DROP COLUMN "organization_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Plans" ADD "organization_id" uniqueidentifier NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "dbo"."organizations" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."organizations" ADD "id" uniqueidentifier NOT NULL DEFAULT NEWSEQUENTIALID()`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."organizations" ADD CONSTRAINT "PK_organizations" PRIMARY KEY ("id")`,
    );

    // Re-add foreign keys
    await queryRunner.query(
      `ALTER TABLE "dbo"."Users" ADD CONSTRAINT "FK_Users_organization_id" FOREIGN KEY ("organization_id") REFERENCES "dbo"."organizations"("id") ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Roles" ADD CONSTRAINT "FK_Roles_organization_id" FOREIGN KEY ("organization_id") REFERENCES "dbo"."organizations"("id") ON DELETE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dbo"."Plans" ADD CONSTRAINT "FK_Plans_organization_id" FOREIGN KEY ("organization_id") REFERENCES "dbo"."organizations"("id") ON DELETE NO ACTION`,
    );

    // Re-create filtered unique indexes
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_role_name_per_org" ON "dbo"."Roles" ("Name", "organization_id") WHERE "organization_id" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_role_name_global" ON "dbo"."Roles" ("Name") WHERE "organization_id" IS NULL`,
    );
  }
}
