import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1768202510693 implements MigrationInterface {
  name = 'SchemaUpdate1768202510693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Permissions" ("id" int NOT NULL IDENTITY(1,1), "permissions" ntext NOT NULL, "roleId" int, CONSTRAINT "PK_e83fa8a46bd5a3bfaa095d40812" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Roles" ADD CONSTRAINT "UQ_ad152fb549a5b88dccaaf3a1013" UNIQUE ("Name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "Permissions" ADD CONSTRAINT "FK_b113ea79f15a2bae2f904765c8e" FOREIGN KEY ("roleId") REFERENCES "Roles"("Id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Permissions" DROP CONSTRAINT "FK_b113ea79f15a2bae2f904765c8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Roles" DROP CONSTRAINT "UQ_ad152fb549a5b88dccaaf3a1013"`,
    );
    await queryRunner.query(`DROP TABLE "Permissions"`);
  }
}
