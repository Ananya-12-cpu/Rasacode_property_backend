import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1768833162231 implements MigrationInterface {
    name = 'SchemaUpdate1768833162231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`EXEC sp_rename "EliteDB.dbo.Roles.RoleTitle", "role_title"`);
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "role_title"`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD "role_title" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "role_title"`);
        await queryRunner.query(`ALTER TABLE "Roles" ADD "role_title" nvarchar(255)`);
        await queryRunner.query(`EXEC sp_rename "EliteDB.dbo.Roles.role_title", "RoleTitle"`);
    }

}
