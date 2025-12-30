import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1767032891488 implements MigrationInterface {
    name = 'SchemaUpdate1767032891488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("Id" int NOT NULL IDENTITY(1,1), "Name" nvarchar(255) NOT NULL, CONSTRAINT "PK_ab3dbbb04afe867d22e43aacad5" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" int NOT NULL IDENTITY(1,1), "username" nvarchar(255) NOT NULL, "passwordHash" nvarchar(255) NOT NULL, "first_name" nvarchar(255), "last_name" nvarchar(255), "phone_number" nvarchar(255), "refreshTokenHash" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_e11e649824a45d8ed01d597fd93" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_80ca6e6ef65fb9ef34ea8c90f42" DEFAULT getdate(), "two_factor_Enabled" bit NOT NULL CONSTRAINT "DF_915d4c9c7ece55d559bb87aa844" DEFAULT 0, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" int NOT NULL IDENTITY(1,1), "listing_date" date, "listing_price" decimal(12,2), "asking_price" decimal(12,2), "street_address" nvarchar(255), "unit_apt" nvarchar(255), "city" nvarchar(255), "state" nvarchar(255), "zip_code" nvarchar(255), "county" nvarchar(255), "property_type" nvarchar(255), "bedrooms" int, "bathrooms" int, "square_feet" int, "lot_size" nvarchar(255), "year_built" int, "garage_spaces" int NOT NULL CONSTRAINT "DF_39913ab658eee298604154f8f3b" DEFAULT 0, "parking_spaces" int NOT NULL CONSTRAINT "DF_239a9d8b0237673edf3dd7c5978" DEFAULT 0, "roof_age" nvarchar(255), "roof_status" nvarchar(255), "interior_condition" nvarchar(255), "exterior_paint_required" bit NOT NULL CONSTRAINT "DF_072176c3d848e7126f394004b99" DEFAULT 0, "new_floor_required" bit NOT NULL CONSTRAINT "DF_b06577cf92ebe91ce158dfdfe33" DEFAULT 0, "kitchen_renovation_required" bit NOT NULL CONSTRAINT "DF_bbd14e7b35835344755aed9e62c" DEFAULT 0, "bathroom_renovation_required" bit NOT NULL CONSTRAINT "DF_ccb2214714d7aca4b0731d64534" DEFAULT 0, "drywall_repair_required" bit NOT NULL CONSTRAINT "DF_cfda2e9ac1cd8a5d497bea515ee" DEFAULT 0, "interior_paint_required" bit NOT NULL CONSTRAINT "DF_e98badc8e59026399a4ba26d3d4" DEFAULT 0, "arv" decimal(12,2), "repair_estimate" decimal(12,2), "holding_costs" decimal(12,2), "transaction_type" nvarchar(255), "assignment_fee" decimal(12,2), "property_description" text, "seller_notes" text, "images" ntext, "created_at" datetime2 NOT NULL CONSTRAINT "DF_4915046e5cbff930085ebdf8493" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_dd0008be5df9ed6976a94ce9491" DEFAULT getdate(), CONSTRAINT "UQ_property_address" UNIQUE ("street_address", "unit_apt", "city", "state", "zip_code"), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userId" int NOT NULL, "roleId" int NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("Id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`);
        await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role"`);
        await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role"`);
        await queryRunner.query(`DROP TABLE "user_roles_role"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
