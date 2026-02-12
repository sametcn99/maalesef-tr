import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from './users.service.js';

const UNVERIFIED_ACCOUNT_TTL_DAYS = 2;

@Injectable()
export class UsersCleanupService {
  private readonly logger = new Logger(UsersCleanupService.name);

  constructor(private readonly usersService: UsersService) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async removeExpiredUnverifiedUsers() {
    const removedCount = await this.usersService.deleteUnverifiedOlderThan(
      UNVERIFIED_ACCOUNT_TTL_DAYS,
    );

    if (removedCount > 0) {
      this.logger.log(
        `${removedCount} unverified account(s) removed after exceeding verification window.`,
      );
    }
  }
}
