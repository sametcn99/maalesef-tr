import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJobsSearchIndexes1775448000000 implements MigrationInterface {
  name = 'AddJobsSearchIndexes1775448000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm`);
    await queryRunner.query(
      `CREATE INDEX "IDX_jobs_title_trgm" ON "jobs" USING GIN ("title" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_jobs_company_trgm" ON "jobs" USING GIN ("company" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_jobs_location_trgm" ON "jobs" USING GIN ("location" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_jobs_short_description_trgm" ON "jobs" USING GIN ("shortDescription" gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_jobs_search_document" ON "jobs" USING GIN (to_tsvector('simple', concat_ws(' ', coalesce("title", ''), coalesce("company", ''), coalesce("location", ''), coalesce("shortDescription", ''), coalesce("fullDescription", ''))))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_jobs_search_document"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_jobs_short_description_trgm"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_jobs_location_trgm"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_jobs_company_trgm"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_jobs_title_trgm"`);
  }
}
