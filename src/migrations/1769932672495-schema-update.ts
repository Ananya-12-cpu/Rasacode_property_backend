import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1769932672495 implements MigrationInterface {
  name = 'SchemaUpdate1769932672495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "pincode"`);
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "profile_picture"`,
    );
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "bio"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "company_name"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "designation"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "experience"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "specialization"`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "email" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "gender" nvarchar(255)`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "profile_image" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "address_line_1" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "address_line_2" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "Users" ADD "zip_code" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "date_of_birth"`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "date_of_birth" datetime`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "date_of_birth"`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "date_of_birth" date`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "zip_code"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "address_line_2"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "address_line_1"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "profile_image"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "gender"`);
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "specialization" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "experience" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "designation" nvarchar(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "company_name" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "Users" ADD "bio" text`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "profile_picture" nvarchar(255)`,
    );
    await queryRunner.query(`ALTER TABLE "Users" ADD "pincode" nvarchar(255)`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "address" nvarchar(255)`);
  }
}
