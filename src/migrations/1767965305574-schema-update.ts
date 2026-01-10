import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1767965305574 implements MigrationInterface {
  name = 'SchemaUpdate1767965305574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RealEstateProperties" DROP COLUMN "documents"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "RealEstateProperties" ADD "documents" ntext`,
    );
  }
}
