import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1770013892994 implements MigrationInterface {
    name = 'SchemaUpdate1770013892994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organizations" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_6b031fcd0863e3f6b44230163f9" DEFAULT NEWSEQUENTIALID(), "name" varchar(255) NOT NULL, "subdomain" varchar(100), "domain" varchar(255), "industry" varchar(100), "size" varchar(50), "logo_url" nvarchar(max), "settings" nvarchar(max) NOT NULL CONSTRAINT "DF_0793edc15659bb7e181fe92a8f1" DEFAULT '{}', "status" varchar(20) NOT NULL CONSTRAINT "DF_f3770f157bd77d83ab022e92fc8" DEFAULT 'active', "created_at" datetime2 NOT NULL CONSTRAINT "DF_016dacd1399bee33b39ad7fa974" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_bd550b2a276afcb8d855faee422" DEFAULT getdate(), CONSTRAINT "UQ_0660118ba6c48a1781452f75b63" UNIQUE ("subdomain"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "organizations"`);
    }

}
