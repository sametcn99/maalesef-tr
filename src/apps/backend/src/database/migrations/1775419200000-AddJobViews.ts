import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJobViews1775419200000 implements MigrationInterface {
  name = 'AddJobViews1775419200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "job_views" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "jobId" uuid NOT NULL, "lastViewedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_job_views_user_job" UNIQUE ("userId", "jobId"), CONSTRAINT "PK_job_views_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_job_views_job_id" ON "job_views" ("jobId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_job_views_user_last_viewed_at" ON "job_views" ("userId", "lastViewedAt")`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_views" ADD CONSTRAINT "FK_job_views_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_views" ADD CONSTRAINT "FK_job_views_job" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "job_views" DROP CONSTRAINT "FK_job_views_job"`,
    );
    await queryRunner.query(
      `ALTER TABLE "job_views" DROP CONSTRAINT "FK_job_views_user"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_job_views_user_last_viewed_at"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_job_views_job_id"`);
    await queryRunner.query(`DROP TABLE "job_views"`);
  }
}
