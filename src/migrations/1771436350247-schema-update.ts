import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1771436350247 implements MigrationInterface {
    name = 'SchemaUpdate1771436350247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD "images" ntext`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP CONSTRAINT "DF_f04400e726a27484fb0118febd6"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD CONSTRAINT "DF_f04400e726a27484fb0118febd6" DEFAULT 'active' FOR "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP CONSTRAINT "DF_f04400e726a27484fb0118febd6"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" ADD CONSTRAINT "DF_f04400e726a27484fb0118febd6" DEFAULT 'pending' FOR "status"`);
        await queryRunner.query(`ALTER TABLE "PropertyRentals" DROP COLUMN "images"`);
    }

}
