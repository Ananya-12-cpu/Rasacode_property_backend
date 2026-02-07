import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1770453031098 implements MigrationInterface {
    name = 'SchemaUpdate1770453031098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "UQ_role_name_per_org" ON "Roles"`);
        await queryRunner.query(`DROP INDEX "UQ_role_name_global" ON "Roles"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "UQ_0660118ba6c48a1781452f75b63"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "subdomain"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "domain"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "logo_url"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "DF_0793edc15659bb7e181fe92a8f1"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "settings"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "DF_f3770f157bd77d83ab022e92fc8"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "status" varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "DF_f3770f157bd77d83ab022e92fc8" DEFAULT 'active' FOR "status"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "settings" nvarchar(MAX) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "DF_0793edc15659bb7e181fe92a8f1" DEFAULT '{}' FOR "settings"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "logo_url" nvarchar(MAX)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "size" varchar(50)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "domain" varchar(255)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "subdomain" varchar(100)`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "UQ_0660118ba6c48a1781452f75b63" UNIQUE ("subdomain")`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_role_name_global" ON "Roles" ("Name") WHERE ([organization_id] IS NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_role_name_per_org" ON "Roles" ("Name", "organization_id") WHERE ([organization_id] IS NOT NULL)`);
    }

}
