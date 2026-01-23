import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1769072511833 implements MigrationInterface {
  name = 'SchemaUpdate1769072511833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Plans" ("id" int NOT NULL IDENTITY(1,1), "name" nvarchar(255) NOT NULL, "display_name" nvarchar(255), "description" text, "price" decimal(10,2) NOT NULL, "billing_cycle" varchar(20) NOT NULL CONSTRAINT "DF_968e446a083ad383c6c779b3ca0" DEFAULT 'monthly', "plan_type" varchar(20) NOT NULL, "role_id" int NOT NULL, "is_active" bit NOT NULL CONSTRAINT "DF_e058abd19478947e580d80ebe52" DEFAULT 1, "features" ntext, "created_at" datetime2 NOT NULL CONSTRAINT "DF_efb567a86142c125086cea731ed" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_c2a0b2cec57c7062679f618d26f" DEFAULT getdate(), CONSTRAINT "UQ_f592c998f5ce595a706c66b1f75" UNIQUE ("name"), CONSTRAINT "PK_a659f1806d1b1fd78fe46766332" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Plans" ADD CONSTRAINT "FK_291b7acf43e9d5108092d8c6b71" FOREIGN KEY ("role_id") REFERENCES "Roles"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Plans" DROP CONSTRAINT "FK_291b7acf43e9d5108092d8c6b71"`,
    );
    await queryRunner.query(`DROP TABLE "Plans"`);
  }
}
