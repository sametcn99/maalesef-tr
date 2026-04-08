import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBackendHotPathIndexes1775667000000 implements MigrationInterface {
  name = 'AddBackendHotPathIndexes1775667000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_applications_user_status_updated_at" ON "applications" ("userId", "status", "updatedAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_applications_pending_due_at" ON "applications" ("evaluationDueAt", "appliedAt") WHERE "status" = 'pending' AND "feedback" IS NULL AND "nextEvaluationAt" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_applications_pending_next_evaluation" ON "applications" ("nextEvaluationAt", "appliedAt") WHERE "status" = 'pending' AND "feedback" IS NULL AND "nextEvaluationAt" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_notifications_user_read_created_at" ON "notifications" ("userId", "read", "createdAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_jobs_created_by_created_at" ON "jobs" ("createdById", "createdAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_notification_email_window" ON "users" ("notificationEmailEnabled", "lastNotificationEmailSentAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_users_notification_email_window"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_jobs_created_by_created_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_notifications_user_read_created_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_applications_pending_next_evaluation"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_applications_pending_due_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_applications_user_status_updated_at"`,
    );
  }
}
