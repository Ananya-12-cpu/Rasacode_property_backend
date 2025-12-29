import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProperty1768000000000 implements MigrationInterface {
  name = 'AddProperty1768000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "properties" (
      "id" int NOT NULL IDENTITY(1,1),
      "listing_date" date,
      "listing_price" decimal(12,2),
      "asking_price" decimal(12,2),
      "street_address" nvarchar(255),
      "unit_apt" nvarchar(255),
      "city" nvarchar(255),
      "state" nvarchar(255),
      "zip_code" nvarchar(255),
      "county" nvarchar(255),
      "property_type" nvarchar(255),
      "bedrooms" int,
      "bathrooms" int,
      "square_feet" int,
      "lot_size" nvarchar(255),
      "year_built" int,
      "garage_spaces" int DEFAULT 0,
      "parking_spaces" int DEFAULT 0,
      "roof_age" nvarchar(255),
      "roof_status" nvarchar(255),
      "interior_condition" nvarchar(255),
      "exterior_paint_required" bit DEFAULT 0,
      "new_floor_required" bit DEFAULT 0,
      "kitchen_renovation_required" bit DEFAULT 0,
      "bathroom_renovation_required" bit DEFAULT 0,
      "drywall_repair_required" bit DEFAULT 0,
      "interior_paint_required" bit DEFAULT 0,
      "arv" decimal(12,2),
      "repair_estimate" decimal(12,2),
      "holding_costs" decimal(12,2),
      "transaction_type" nvarchar(255),
      "assignment_fee" decimal(12,2),
      "property_description" text,
      "seller_notes" text,
      "images" nvarchar(MAX),
      "created_at" datetime2 NOT NULL DEFAULT getdate(),
      "updated_at" datetime2 NOT NULL DEFAULT getdate(),
      CONSTRAINT "PK_properties_id" PRIMARY KEY ("id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "properties"`);
  }
}
