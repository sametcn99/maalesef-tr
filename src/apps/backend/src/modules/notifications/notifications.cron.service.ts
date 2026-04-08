import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersRepository } from '../users/users.repository.js';
import { NotificationsRepository } from './notifications.repository.js';
import { MailService } from '../mail/mail.service.js';
import type { NotificationEntity } from './entities/notification.entity.js';

@Injectable()
export class NotificationsCronService {
  private readonly logger = new Logger(NotificationsCronService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly notificationsRepository: NotificationsRepository,
    private readonly mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Can be adjusted, but every day check is fine
  async handleNotificationEmails() {
    this.logger.log('Starting notification email summary job...');

    // Find users eligible for notification email (enabled AND >2 days since last email AND have unread notifications)
    const eligibleUsers =
      await this.usersRepository.findEligibleForNotificationEmail();

    this.logger.log(
      `Found ${eligibleUsers.length} users eligible for notification emails.`,
    );

    const unreadByUserId = this.groupUnreadByUserId(
      await this.notificationsRepository.findUnreadForUserIds(
        eligibleUsers.map((user) => user.id),
      ),
    );

    for (const user of eligibleUsers) {
      const unreadOnly = unreadByUserId.get(user.id) ?? [];

      if (unreadOnly.length > 0) {
        await this.mailService.sendNotificationSummary(
          user.email,
          user.name,
          unreadOnly.map((n) => ({
            title: n.title,
            body: n.body,
            priority: n.priority,
          })),
        );

        await this.usersRepository.updateLastNotificationEmailSentAt(
          user.id,
          new Date(),
        );
        this.logger.log(
          `Sent notification summary to ${user.email} (${unreadOnly.length} unread).`,
        );
      }
    }
  }

  private groupUnreadByUserId(notifications: NotificationEntity[]) {
    const grouped = new Map<string, NotificationEntity[]>();

    for (const notification of notifications) {
      const existing = grouped.get(notification.userId) ?? [];
      existing.push(notification);
      grouped.set(notification.userId, existing);
    }

    return grouped;
  }
}
