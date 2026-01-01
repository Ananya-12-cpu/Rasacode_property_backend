import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1767272647109 implements MigrationInterface {
  name = 'SchemaUpdate1767272647109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RealEstateProperties" DROP CONSTRAINT "UQ_property_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RealEstateProperties" ADD CONSTRAINT "UQ_realestateproperty_address" UNIQUE ("street_address", "unit_apt", "city", "state", "zip_code")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RealEstateProperties" DROP CONSTRAINT "UQ_realestateproperty_address"`,
    );
    await queryRunner.query(
      `ALTER TABLE "RealEstateProperties" ADD CONSTRAINT "UQ_property_address" UNIQUE ("city", "state", "street_address", "unit_apt", "zip_code")`,
    );
  }
}
