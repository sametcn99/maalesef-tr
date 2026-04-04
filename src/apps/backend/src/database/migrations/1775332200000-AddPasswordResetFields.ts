import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordResetFields1775332200000 implements MigrationInterface {
  name = 'AddPasswordResetFields1775332200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD "passwordResetToken" uuid',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD CONSTRAINT "UQ_users_password_reset_token" UNIQUE ("passwordResetToken")',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "passwordResetTokenExpiresAt" TIMESTAMP WITH TIME ZONE',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "passwordResetLastSentAt" TIMESTAMP WITH TIME ZONE',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ADD "lastPasswordChangedAt" TIMESTAMP WITH TIME ZONE',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" DROP COLUMN "lastPasswordChangedAt"',
    );
    await queryRunner.query(
      'ALTER TABLE "users" DROP COLUMN "passwordResetLastSentAt"',
    );
    await queryRunner.query(
      'ALTER TABLE "users" DROP COLUMN "passwordResetTokenExpiresAt"',
    );
    await queryRunner.query(
      'ALTER TABLE "users" DROP CONSTRAINT "UQ_users_password_reset_token"',
    );
    await queryRunner.query(
      'ALTER TABLE "users" DROP COLUMN "passwordResetToken"',
    );
  }
}
