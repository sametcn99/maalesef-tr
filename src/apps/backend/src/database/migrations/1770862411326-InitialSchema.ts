import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1770862411326 implements MigrationInterface {
  name = 'InitialSchema1770862411326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `CREATE TYPE "public"."applications_status_enum" AS ENUM('pending', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_badges_type_enum" AS ENUM('REJECTION', 'SHARE', 'JOB_POST')`,
    );
    await queryRunner.query(
      `CREATE TABLE "jobs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "slug" character varying(255), "company" character varying(255) NOT NULL, "location" character varying(255) NOT NULL, "shortDescription" text NOT NULL, "fullDescription" text NOT NULL, "requirements" jsonb NOT NULL DEFAULT '[]', "questions" jsonb NOT NULL DEFAULT '[]', "createdById" uuid, CONSTRAINT "UQ_ebf78eba11615c490d5db84451a" UNIQUE ("slug"), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "jobId" uuid NOT NULL, "jobTitle" character varying(255) NOT NULL, "jobSlug" character varying(255), "status" "public"."applications_status_enum" NOT NULL DEFAULT 'pending', "answers" jsonb NOT NULL DEFAULT '{}', "cvText" text, "aiConsent" boolean NOT NULL DEFAULT false, "feedback" text, "evaluationDueAt" TIMESTAMP WITH TIME ZONE, "nextEvaluationAt" TIMESTAMP WITH TIME ZONE, "evaluationAttempts" integer NOT NULL DEFAULT '0', "lastEvaluationError" text, "appliedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "title" character varying(255) NOT NULL, "body" text NOT NULL, "read" boolean NOT NULL DEFAULT false, "shareable" boolean NOT NULL DEFAULT false, "type" character varying(50) NOT NULL DEFAULT 'info', "priority" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_badges" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "badgeName" character varying(255) NOT NULL, "type" "public"."user_badges_type_enum" NOT NULL, "threshold" integer NOT NULL, CONSTRAINT "PK_0ca139216824d745a930065706a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "emailVerified" boolean NOT NULL DEFAULT false, "emailVerifiedAt" TIMESTAMP WITH TIME ZONE, "emailVerificationToken" uuid, "emailVerificationTokenExpiresAt" TIMESTAMP WITH TIME ZONE, "emailVerificationLastSentAt" TIMESTAMP WITH TIME ZONE, "shareCount" integer NOT NULL DEFAULT '0', "slug" character varying(255), "bio" text, "lastNotificationEmailSentAt" TIMESTAMP WITH TIME ZONE, "notificationEmailEnabled" boolean NOT NULL DEFAULT true, "visibilitySettings" jsonb NOT NULL DEFAULT '{"showApplications":true,"showRejections":true,"showRecentActivity":true,"showJobs":true,"showBio":true,"showBadges":true}', "refreshToken" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_7ad75a333a7bcf6a2b5d3517ca8" UNIQUE ("emailVerificationToken"), CONSTRAINT "UQ_bc0c27d77ee64f0a097a5c269b3" UNIQUE ("slug"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD CONSTRAINT "FK_942364c910910a09a018566455e" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" ADD CONSTRAINT "FK_f6ebb8bc5061068e4dd97df3c77" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_badges" ADD CONSTRAINT "FK_7043fd1cb64ec3f5ebdb878966c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_badges" DROP CONSTRAINT "FK_7043fd1cb64ec3f5ebdb878966c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_f6ebb8bc5061068e4dd97df3c77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" DROP CONSTRAINT "FK_942364c910910a09a018566455e"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_badges"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "applications"`);
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TYPE "public"."user_badges_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."applications_status_enum"`);
  }
}
