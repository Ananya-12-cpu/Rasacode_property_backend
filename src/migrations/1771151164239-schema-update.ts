import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1771151164239 implements MigrationInterface {
    name = 'SchemaUpdate1771151164239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PendingRealEstateProperties" ("id" int NOT NULL IDENTITY(1,1), "status" varchar(20) NOT NULL CONSTRAINT "DF_201b43e9b1d2b41b59781ca5a26" DEFAULT 'pending', "created_by" int NOT NULL, "reviewed_by" int, "reviewed_at" datetime2, "rejection_reason" text, "listing_date" date, "listing_price" decimal(12,2), "asking_price" decimal(12,2), "street_address" nvarchar(255), "unit_apt" nvarchar(255), "city" nvarchar(255), "state" nvarchar(255), "zip_code" nvarchar(255), "county" nvarchar(255), "property_type" nvarchar(255), "bedrooms" int, "bathrooms" int, "square_feet" int, "lot_size" nvarchar(255), "year_built" int, "garage_spaces" int NOT NULL CONSTRAINT "DF_265888da5dde7c593b280a83e7c" DEFAULT 0, "parking_spaces" int NOT NULL CONSTRAINT "DF_c528c7afebb69dcf014167ff1fe" DEFAULT 0, "roof_age" nvarchar(255), "roof_status" nvarchar(255), "interior_condition" nvarchar(255), "exterior_paint_required" bit NOT NULL CONSTRAINT "DF_38a2501c61ec1c98c28c9a62832" DEFAULT 0, "new_floor_required" bit NOT NULL CONSTRAINT "DF_c069f361303dbea676050ff78b8" DEFAULT 0, "kitchen_renovation_required" bit NOT NULL CONSTRAINT "DF_74e54efc0227d2ba6b6a020c15f" DEFAULT 0, "bathroom_renovation_required" bit NOT NULL CONSTRAINT "DF_e79b9cf9ec8a2085001296cbfd6" DEFAULT 0, "drywall_repair_required" bit NOT NULL CONSTRAINT "DF_d072d516a98f6bbaf7feb317f04" DEFAULT 0, "interior_paint_required" bit NOT NULL CONSTRAINT "DF_fde5245bc001ac328fc06e5d935" DEFAULT 0, "arv" decimal(12,2), "repair_estimate" decimal(12,2), "holding_costs" decimal(12,2), "transaction_type" nvarchar(255), "assignment_fee" decimal(12,2), "property_description" text, "seller_notes" text, "images" ntext, "created_at" datetime2 NOT NULL CONSTRAINT "DF_d2803b5611beeca914359273875" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_9a1691fdbbc8d2429ce627013bf" DEFAULT getdate(), CONSTRAINT "PK_d60727e598a23eeccc1e62f4d04" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "PendingRealEstateProperties" ADD CONSTRAINT "FK_8ac8aa5aea6eda324f5686ae646" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PendingRealEstateProperties" ADD CONSTRAINT "FK_29fac6e624bb0f6e31d383c7a97" FOREIGN KEY ("reviewed_by") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PendingRealEstateProperties" DROP CONSTRAINT "FK_29fac6e624bb0f6e31d383c7a97"`);
        await queryRunner.query(`ALTER TABLE "PendingRealEstateProperties" DROP CONSTRAINT "FK_8ac8aa5aea6eda324f5686ae646"`);
        await queryRunner.query(`DROP TABLE "PendingRealEstateProperties"`);
    }

}
