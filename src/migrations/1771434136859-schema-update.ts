import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1771434136859 implements MigrationInterface {
    name = 'SchemaUpdate1771434136859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP CONSTRAINT "FK_afa7dea845a686bffba15b654e5"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP CONSTRAINT "FK_d53ee6646cd8265f140640d32dd"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "property_id"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "tenant_id"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "street_address" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "unit_apt" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "city" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "state" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "zip_code" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "county" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "property_type" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "bedrooms" int`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "bathrooms" int`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "square_feet" int`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "lot_size" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "year_built" int`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "garage_spaces" int NOT NULL CONSTRAINT "DF_b2fd23c98e903c102c1023ebcd2" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "parking_spaces" int NOT NULL CONSTRAINT "DF_df0ca148dd5516064f7d6c495c7" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "roof_age" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "roof_status" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "roof_status"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "roof_age"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP CONSTRAINT "DF_df0ca148dd5516064f7d6c495c7"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "parking_spaces"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP CONSTRAINT "DF_b2fd23c98e903c102c1023ebcd2"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "garage_spaces"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "year_built"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "lot_size"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "square_feet"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "bathrooms"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "bedrooms"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "property_type"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "county"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "zip_code"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "unit_apt"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "street_address"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "tenant_id" int`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "property_id" int NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD CONSTRAINT "FK_d53ee6646cd8265f140640d32dd" FOREIGN KEY ("tenant_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD CONSTRAINT "FK_afa7dea845a686bffba15b654e5" FOREIGN KEY ("property_id") REFERENCES "RealEstateProperties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
