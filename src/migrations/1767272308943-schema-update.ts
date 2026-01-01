import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1767272308943 implements MigrationInterface {
  name = 'SchemaUpdate1767272308943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Roles" ("Id" int NOT NULL IDENTITY(1,1), "Name" nvarchar(255) NOT NULL, CONSTRAINT "PK_04f7be88261f9d1e55675c0ee75" PRIMARY KEY ("Id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "RealEstateProperties" ("id" int NOT NULL IDENTITY(1,1), "listing_date" date, "listing_price" decimal(12,2), "asking_price" decimal(12,2), "street_address" nvarchar(255), "unit_apt" nvarchar(255), "city" nvarchar(255), "state" nvarchar(255), "zip_code" nvarchar(255), "county" nvarchar(255), "property_type" nvarchar(255), "bedrooms" int, "bathrooms" int, "square_feet" int, "lot_size" nvarchar(255), "year_built" int, "garage_spaces" int NOT NULL CONSTRAINT "DF_a9074356595edc77727fd6eef2c" DEFAULT 0, "parking_spaces" int NOT NULL CONSTRAINT "DF_f893e03e4ab448e27203897c68a" DEFAULT 0, "roof_age" nvarchar(255), "roof_status" nvarchar(255), "interior_condition" nvarchar(255), "exterior_paint_required" bit NOT NULL CONSTRAINT "DF_51b1c4c21ce153a3b47233bb8c7" DEFAULT 0, "new_floor_required" bit NOT NULL CONSTRAINT "DF_98a597fc8e098cb8de8ab6efd8c" DEFAULT 0, "kitchen_renovation_required" bit NOT NULL CONSTRAINT "DF_cf19e717df1614cfe750c344c4d" DEFAULT 0, "bathroom_renovation_required" bit NOT NULL CONSTRAINT "DF_ae5b8b849effe636813079ed883" DEFAULT 0, "drywall_repair_required" bit NOT NULL CONSTRAINT "DF_4616e039405c946bfdffa608c27" DEFAULT 0, "interior_paint_required" bit NOT NULL CONSTRAINT "DF_3d76fa9dd38c800dcaf4d81347a" DEFAULT 0, "arv" decimal(12,2), "repair_estimate" decimal(12,2), "holding_costs" decimal(12,2), "transaction_type" nvarchar(255), "assignment_fee" decimal(12,2), "property_description" text, "seller_notes" text, "images" ntext, "created_at" datetime2 NOT NULL CONSTRAINT "DF_a08f71b2d8c643c391210c89a5a" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_bd15b2b81ee387de9333984fe42" DEFAULT getdate(), CONSTRAINT "UQ_property_address" UNIQUE ("street_address", "unit_apt", "city", "state", "zip_code"), CONSTRAINT "PK_e19f66a0bf6cb01457567d6fc46" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "UserPropertyLikes" ("id" int NOT NULL IDENTITY(1,1), "created_at" datetime2 NOT NULL CONSTRAINT "DF_a86f28700079854c7510022cb27" DEFAULT getdate(), "user_id" int, "property_id" int, CONSTRAINT "UQ_a35073c8a7e01749b9c627b6adb" UNIQUE ("user_id", "property_id"), CONSTRAINT "PK_2cc5693dcb2842fa7a28372a79f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" int NOT NULL IDENTITY(1,1), "username" nvarchar(255) NOT NULL, "passwordHash" nvarchar(255) NOT NULL, "first_name" nvarchar(255), "last_name" nvarchar(255), "phone_number" nvarchar(255), "refreshTokenHash" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_4d6dcaa56443847d1fdb3f589cd" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_61ffd183b0382276c2d733ff018" DEFAULT getdate(), "two_factor_Enabled" bit NOT NULL CONSTRAINT "DF_16fafed1801509f55c61b6cdb69" DEFAULT 0, CONSTRAINT "UQ_ffc81a3b97dcbf8e320d5106c0d" UNIQUE ("username"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_roles_roles" ("usersId" int NOT NULL, "rolesId" int NOT NULL, CONSTRAINT "PK_6c1a055682c229f5a865f2080c1" PRIMARY KEY ("usersId", "rolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df951a64f09865171d2d7a502b" ON "users_roles_roles" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2f0366aa9349789527e0c36d9" ON "users_roles_roles" ("rolesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "UserPropertyLikes" ADD CONSTRAINT "FK_284925ed56e82f54ed12144ca55" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserPropertyLikes" ADD CONSTRAINT "FK_ae2cd2f201617a261c2860c8129" FOREIGN KEY ("property_id") REFERENCES "RealEstateProperties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_b2f0366aa9349789527e0c36d97" FOREIGN KEY ("rolesId") REFERENCES "Roles"("Id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_b2f0366aa9349789527e0c36d97"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_df951a64f09865171d2d7a502b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserPropertyLikes" DROP CONSTRAINT "FK_ae2cd2f201617a261c2860c8129"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserPropertyLikes" DROP CONSTRAINT "FK_284925ed56e82f54ed12144ca55"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_b2f0366aa9349789527e0c36d9" ON "users_roles_roles"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_df951a64f09865171d2d7a502b" ON "users_roles_roles"`,
    );
    await queryRunner.query(`DROP TABLE "users_roles_roles"`);
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TABLE "UserPropertyLikes"`);
    await queryRunner.query(`DROP TABLE "RealEstateProperties"`);
    await queryRunner.query(`DROP TABLE "Roles"`);
  }
}
