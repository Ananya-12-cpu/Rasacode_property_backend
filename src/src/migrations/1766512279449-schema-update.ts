import type { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1766512279449 implements MigrationInterface {
  name = 'SchemaUpdate1766512279449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("Id" int NOT NULL IDENTITY(1,1), "Name" nvarchar(255) NOT NULL, CONSTRAINT "PK_ab3dbbb04afe867d22e43aacad5" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "username" nvarchar(255) NOT NULL, "passwordHash" nvarchar(255) NOT NULL, "first_name" nvarchar(255), "last_name" nvarchar(255), "phone_number" nvarchar(255), "refreshTokenHash" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_e11e649824a45d8ed01d597fd93" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_80ca6e6ef65fb9ef34ea8c90f42" DEFAULT getdate(), "two_factor_Enabled" bit NOT NULL CONSTRAINT "DF_915d4c9c7ece55d559bb87aa844" DEFAULT 0, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles_role" ("userId" int NOT NULL, "roleId" int NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("Id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles_role"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
