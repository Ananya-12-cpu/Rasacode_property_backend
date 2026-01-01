import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1767033087983 implements MigrationInterface {
  name = 'SchemaUpdate1767033087983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "properties" ADD "is_deleted" bit NOT NULL CONSTRAINT "DF_a8018ef316a7244592fd28bc1b3" DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "properties" DROP CONSTRAINT "DF_a8018ef316a7244592fd28bc1b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties" DROP COLUMN "is_deleted"`,
    );
  }
}
