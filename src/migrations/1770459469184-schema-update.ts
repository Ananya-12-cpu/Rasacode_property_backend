import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1770459469184 implements MigrationInterface {
    name = 'SchemaUpdate1770459469184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Plans" DROP CONSTRAINT "FK_Plans_organization_id"`);
        await queryRunner.query(`ALTER TABLE "Roles" DROP CONSTRAINT "FK_Roles_organization_id"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_Users_organization_id"`);
        await queryRunner.query(`DROP INDEX "UQ_role_name_per_org" ON "Roles"`);
        await queryRunner.query(`DROP INDEX "UQ_role_name_global" ON "Roles"`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD "size" varchar(50)`);
        await queryRunner.query(`ALTER TABLE "Plans" ADD CONSTRAINT "FK_52be572642b896f25cec2454284" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD CONSTRAINT "FK_2909321a16bc558f799b3e0841e" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_bf95e9cc1a46684dc8f40f2a925" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_bf95e9cc1a46684dc8f40f2a925"`);
        await queryRunner.query(`ALTER TABLE "Roles" DROP CONSTRAINT "FK_2909321a16bc558f799b3e0841e"`);
        await queryRunner.query(`ALTER TABLE "Plans" DROP CONSTRAINT "FK_52be572642b896f25cec2454284"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "size"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_role_name_global" ON "Roles" ("Name") WHERE ([organization_id] IS NULL)`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_role_name_per_org" ON "Roles" ("Name", "organization_id") WHERE ([organization_id] IS NOT NULL)`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_Users_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD CONSTRAINT "FK_Roles_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Plans" ADD CONSTRAINT "FK_Plans_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
