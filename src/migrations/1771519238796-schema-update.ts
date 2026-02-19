import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1771519238796 implements MigrationInterface {
    name = 'SchemaUpdate1771519238796'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "rent_frequency" varchar(20)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "lease_duration_months" int`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "available_from" date`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "smoking_policy" varchar(30)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "is_furnished" bit NOT NULL CONSTRAINT "DF_8009af484c65f6a22fb59f88e4f" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "pets_allowed" bit NOT NULL CONSTRAINT "DF_0af354caea6aa3b66d5574c05fd" DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "application_fee" decimal(12,2)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "move_in_fees" decimal(12,2)`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "utilities_included" ntext`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "amenities" ntext`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "amenities"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "utilities_included"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "move_in_fees"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "application_fee"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP CONSTRAINT "DF_0af354caea6aa3b66d5574c05fd"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "pets_allowed"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP CONSTRAINT "DF_8009af484c65f6a22fb59f88e4f"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "is_furnished"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "smoking_policy"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "available_from"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "lease_duration_months"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "rent_frequency"`);
    }

}
