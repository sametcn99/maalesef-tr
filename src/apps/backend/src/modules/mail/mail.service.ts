import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { TemplateRendererService } from '../../common/templates/template-renderer.service.js';

import { NOTIFICATION_EMAIL_MESSAGES } from './common/notification-email-messages.js';
import { REJECTION_SHARE_MESSAGES } from './common/rejection-share-messages.js';

type MailTemplateContext = Record<string, unknown>;

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly backendUrl: string;
  private readonly frontendUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly templateRenderer: TemplateRendererService,
  ) {
    this.from = this.configService.getOrThrow<string>('MAIL_FROM');
    this.backendUrl = this.configService.getOrThrow<string>(
      'SERVICE_URL_BACKEND',
    );
    this.frontendUrl = this.configService.getOrThrow<string>(
      'SERVICE_URL_FRONTEND',
    );

    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('SMTP_HOST'),
      port: this.configService.getOrThrow<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.getOrThrow<string>('SMTP_USER'),
        pass: this.configService.getOrThrow<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmailVerification(to: string, token: string): Promise<void> {
    const verificationUrl = this.buildVerificationUrl(token);
    const { text, html } = await this.renderMailVariants('email-verification', {
      verificationUrl,
      year: this.getCurrentYear(),
    });

    const subject = 'E-posta Doğrulama';

    try {
      await this.transporter.sendMail({
        to,
        from: this.from,
        subject,
        text,
        html,
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error('Verification email could not be sent.', err?.stack);
      throw new InternalServerErrorException(
        'Doğrulama e-postası gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
      );
    }
  }

  private buildVerificationUrl(token: string): string {
    const url = new URL('/auth/verify-email/', this.backendUrl);
    url.pathname = url.pathname.endsWith('/')
      ? `${url.pathname}${token}`
      : `${url.pathname}/${token}`;

    return url.toString();
  }

  async sendPasswordReset(to: string, token: string): Promise<void> {
    const resetUrl = this.buildPasswordResetUrl(token);
    const { text, html } = await this.renderMailVariants('password-reset', {
      resetUrl,
      year: this.getCurrentYear(),
    });
    const subject = 'Şifre Sıfırlama';

    try {
      await this.transporter.sendMail({
        to,
        from: this.from,
        subject,
        text,
        html,
      });
    } catch (error) {
      const err = error as Error;
      this.logger.error('Password reset email could not be sent.', err?.stack);
      throw new InternalServerErrorException(
        'Şifre sıfırlama e-postası gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
      );
    }
  }

  private buildPasswordResetUrl(token: string): string {
    const url = new URL('/reset-password', this.frontendUrl);
    url.searchParams.set('token', token);

    return url.toString();
  }

  async sendNotificationSummary(
    to: string,
    name: string,
    notifications: { title: string; body: string; priority: number }[],
  ): Promise<void> {
    const sortedNotifications = [...notifications].sort(
      (a, b) => b.priority - a.priority,
    );
    const unreadCount = notifications.length;

    const subjectTemplate =
      NOTIFICATION_EMAIL_MESSAGES.SUBJECTS[
        Math.floor(Math.random() * NOTIFICATION_EMAIL_MESSAGES.SUBJECTS.length)
      ];
    const subject = subjectTemplate.replace('{count}', unreadCount.toString());
    const welcomeMessage = this.buildNotificationSummaryTemplate(unreadCount);

    const { text, html } = await this.renderMailVariants(
      'notification-summary',
      {
        name,
        unreadCount,
        notifications: sortedNotifications.map(({ title, body }) => ({
          title,
          body,
        })),
        welcomeMessage,
        notificationsUrl: this.backendUrl,
        profileSettingsUrl: `${this.backendUrl}/profile/settings`,
        year: this.getCurrentYear(),
      },
    );

    try {
      await this.transporter.sendMail({
        to,
        from: this.from,
        subject,
        text,
        html,
      });
    } catch (error) {
      this.logger.error('Notification summary email could not be sent.', error);
    }
  }

  async sendRejectionEmail(
    to: string,
    name: string,
    jobTitle: string,
    feedback: string,
  ): Promise<void> {
    const subject = `Maalesef: ${jobTitle} Başvurunuz Hakkında`;

    const shareMessage =
      REJECTION_SHARE_MESSAGES[
        Math.floor(Math.random() * REJECTION_SHARE_MESSAGES.length)
      ];
    const { text, html } = await this.renderMailVariants('rejection', {
      name,
      jobTitle,
      feedback,
      showcaseUrl: this.backendUrl,
      profileUrl: `${this.backendUrl}/profile`,
      shareMessage,
      xShareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`,
      linkedInShareUrl: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareMessage)}`,
      year: this.getCurrentYear(),
    });

    try {
      await this.transporter.sendMail({
        to,
        from: this.from,
        subject,
        text,
        html,
      });
    } catch (error) {
      this.logger.error(`Rejection email could not be sent to ${to}`, error);
    }
  }

  private async renderMailVariants(
    templateName: string,
    context: MailTemplateContext,
  ) {
    const [text, html] = await Promise.all([
      this.templateRenderer.renderMailText(templateName, context),
      this.templateRenderer.renderMailHtml(templateName, context),
    ]);

    return { text, html };
  }

  private getCurrentYear() {
    return new Date().getFullYear();
  }

  private buildNotificationSummaryTemplate(unreadCount: number): string {
    const welcomeMessage =
      unreadCount === 1
        ? NOTIFICATION_EMAIL_MESSAGES.SINGLE[
            Math.floor(
              Math.random() * NOTIFICATION_EMAIL_MESSAGES.SINGLE.length,
            )
          ]
        : NOTIFICATION_EMAIL_MESSAGES.MULTIPLE[
            Math.floor(
              Math.random() * NOTIFICATION_EMAIL_MESSAGES.MULTIPLE.length,
            )
          ].replace('{count}', unreadCount.toString());

    return welcomeMessage;
  }
}
