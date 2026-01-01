import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1767270846681 implements MigrationInterface {
  name = 'SchemaUpdate1767270846681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_property_likes" ("id" int NOT NULL IDENTITY(1,1), "created_at" datetime2 NOT NULL CONSTRAINT "DF_be8030540037f521815aab42229" DEFAULT getdate(), "user_id" int, "property_id" int, CONSTRAINT "UQ_19fd23fcefc10eccf6dafabb0bf" UNIQUE ("user_id", "property_id"), CONSTRAINT "PK_d605f13936c381c4edb9e49e280" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties" DROP CONSTRAINT "DF_a8018ef316a7244592fd28bc1b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties" DROP COLUMN "is_deleted"`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_property_likes" ADD CONSTRAINT "FK_646d93d4492b9c338898ac54a27" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_property_likes" ADD CONSTRAINT "FK_690be4a0dfe25a6768f6359f51e" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_property_likes" DROP CONSTRAINT "FK_690be4a0dfe25a6768f6359f51e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_property_likes" DROP CONSTRAINT "FK_646d93d4492b9c338898ac54a27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties" ADD "deleted_at" datetime`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties" ADD "is_deleted" bit NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties" ADD CONSTRAINT "DF_a8018ef316a7244592fd28bc1b3" DEFAULT 0 FOR "is_deleted"`,
    );
    await queryRunner.query(`DROP TABLE "user_property_likes"`);
  }
}
