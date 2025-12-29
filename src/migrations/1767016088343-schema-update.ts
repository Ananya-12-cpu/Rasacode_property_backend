import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1767016088343 implements MigrationInterface {
    name = 'SchemaUpdate1767016088343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "properties" ("id" int NOT NULL IDENTITY(1,1), "listing_date" date, "listing_price" decimal(12,2), "asking_price" decimal(12,2), "street_address" nvarchar(255), "unit_apt" nvarchar(255), "city" nvarchar(255), "state" nvarchar(255), "zip_code" nvarchar(255), "county" nvarchar(255), "property_type" nvarchar(255), "bedrooms" int, "bathrooms" int, "square_feet" int, "lot_size" nvarchar(255), "year_built" int, "garage_spaces" int NOT NULL CONSTRAINT "DF_39913ab658eee298604154f8f3b" DEFAULT 0, "parking_spaces" int NOT NULL CONSTRAINT "DF_239a9d8b0237673edf3dd7c5978" DEFAULT 0, "roof_age" nvarchar(255), "roof_status" nvarchar(255), "interior_condition" nvarchar(255), "exterior_paint_required" bit NOT NULL CONSTRAINT "DF_072176c3d848e7126f394004b99" DEFAULT 0, "new_floor_required" bit NOT NULL CONSTRAINT "DF_b06577cf92ebe91ce158dfdfe33" DEFAULT 0, "kitchen_renovation_required" bit NOT NULL CONSTRAINT "DF_bbd14e7b35835344755aed9e62c" DEFAULT 0, "bathroom_renovation_required" bit NOT NULL CONSTRAINT "DF_ccb2214714d7aca4b0731d64534" DEFAULT 0, "drywall_repair_required" bit NOT NULL CONSTRAINT "DF_cfda2e9ac1cd8a5d497bea515ee" DEFAULT 0, "interior_paint_required" bit NOT NULL CONSTRAINT "DF_e98badc8e59026399a4ba26d3d4" DEFAULT 0, "arv" decimal(12,2), "repair_estimate" decimal(12,2), "holding_costs" decimal(12,2), "transaction_type" nvarchar(255), "assignment_fee" decimal(12,2), "property_description" text, "seller_notes" text, "images" ntext, "created_at" datetime2 NOT NULL CONSTRAINT "DF_4915046e5cbff930085ebdf8493" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_dd0008be5df9ed6976a94ce9491" DEFAULT getdate(), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "properties"`);
    }

}
