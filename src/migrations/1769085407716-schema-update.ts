import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1769085407716 implements MigrationInterface {
    name = 'SchemaUpdate1769085407716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "UserSubscriptions" ("id" int NOT NULL IDENTITY(1,1), "user_id" int NOT NULL, "plan_id" int NOT NULL, "status" varchar(20) NOT NULL CONSTRAINT "DF_4c94a1431649931dc8d7a4fe9ce" DEFAULT 'pending', "payment_status" varchar(20) NOT NULL CONSTRAINT "DF_c11863fd74e45fbc13fcc52066f" DEFAULT 'pending', "start_date" datetime, "end_date" datetime, "amount_paid" decimal(10,2), "payment_method" varchar(100), "transaction_id" varchar(255), "auto_renew" bit NOT NULL CONSTRAINT "DF_deee530b6a429527533a8ad11f7" DEFAULT 0, "cancelled_at" datetime, "cancellation_reason" text, "created_at" datetime2 NOT NULL CONSTRAINT "DF_c202836193781321a14cbc532c8" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_c9ab3ab0a71d9a1fda8d8a58ab2" DEFAULT getdate(), CONSTRAINT "PK_56cefb632fb2c3e9e691137ae8f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "UserSubscriptions" ADD CONSTRAINT "FK_a395657dbaf2e4b564352eabf7a" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserSubscriptions" ADD CONSTRAINT "FK_463527b9b372a5c12ddaad1bb1d" FOREIGN KEY ("plan_id") REFERENCES "Plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "UserSubscriptions" DROP CONSTRAINT "FK_463527b9b372a5c12ddaad1bb1d"`);
        await queryRunner.query(`ALTER TABLE "UserSubscriptions" DROP CONSTRAINT "FK_a395657dbaf2e4b564352eabf7a"`);
        await queryRunner.query(`DROP TABLE "UserSubscriptions"`);
    }

}
