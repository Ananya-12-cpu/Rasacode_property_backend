import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1771430541242 implements MigrationInterface {
  name = 'SchemaUpdate1771430541242';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "PropertyRentals" ("id" int NOT NULL IDENTITY(1,1), "property_id" int NOT NULL, "tenant_id" int, "monthly_rent" decimal(12,2) NOT NULL, "security_deposit" decimal(12,2), "start_date" date NOT NULL, "end_date" date, "status" varchar(20) NOT NULL CONSTRAINT "DF_f04400e726a27484fb0118febd6" DEFAULT 'pending', "notes" text, "created_by" int, "created_at" datetime2 NOT NULL CONSTRAINT "DF_1f936a501a8be156b00d3db0e34" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_b2cbba8851f4ed8bc13bccaea28" DEFAULT getdate(), CONSTRAINT "PK_2fa7e32a6181ed14362fffb7f3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "PropertyRentals" ADD CONSTRAINT "FK_afa7dea845a686bffba15b654e5" FOREIGN KEY ("property_id") REFERENCES "RealEstateProperties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PropertyRentals" ADD CONSTRAINT "FK_d53ee6646cd8265f140640d32dd" FOREIGN KEY ("tenant_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PropertyRentals" ADD CONSTRAINT "FK_7ba6ab8ae317962b12052fa10c7" FOREIGN KEY ("created_by") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PropertyRentals" DROP CONSTRAINT "FK_7ba6ab8ae317962b12052fa10c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PropertyRentals" DROP CONSTRAINT "FK_d53ee6646cd8265f140640d32dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PropertyRentals" DROP CONSTRAINT "FK_afa7dea845a686bffba15b654e5"`,
    );
    await queryRunner.query(`DROP TABLE "PropertyRentals"`);
  }
}
