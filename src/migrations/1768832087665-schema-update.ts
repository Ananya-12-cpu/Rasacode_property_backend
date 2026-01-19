import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1768832087665 implements MigrationInterface {
    name = 'SchemaUpdate1768832087665'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Roles" ADD "RoleTitle" nvarchar(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Roles" DROP COLUMN "RoleTitle"`);
    }

}
