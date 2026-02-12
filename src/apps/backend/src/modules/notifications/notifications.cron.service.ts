import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersRepository } from '../users/users.repository.js';
import { NotificationsRepository } from './notifications.repository.js';
import { MailService } from '../mail/mail.service.js';

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

    for (const user of eligibleUsers) {
      const unreadNotifications =
        await this.notificationsRepository.findByUserId(user.id);
      const unreadOnly = unreadNotifications.filter((n) => !n.read);

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
}
