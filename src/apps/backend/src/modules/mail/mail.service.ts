import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { NOTIFICATION_EMAIL_MESSAGES } from './common/notification-email-messages.js';
import { REJECTION_SHARE_MESSAGES } from './common/rejection-share-messages.js';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly appUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.from = this.configService.getOrThrow<string>('MAIL_FROM');
    this.appUrl = this.configService.getOrThrow<string>('SERVICE_URL_BACKEND');

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

    const subject = 'E-posta Doğrulama';
    const text =
      'Hesabını doğrulamak için aşağıdaki bağlantıya tıkla veya tarayıcına yapıştır:\n' +
      verificationUrl;
    const html = this.buildVerificationTemplate(verificationUrl);

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
    const url = new URL('/auth/verify-email/', this.appUrl);
    url.pathname = url.pathname.endsWith('/')
      ? `${url.pathname}${token}`
      : `${url.pathname}/${token}`;

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

    const html = this.buildNotificationSummaryTemplate(
      name,
      unreadCount,
      sortedNotifications,
    );

    try {
      await this.transporter.sendMail({
        to,
        from: this.from,
        subject,
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

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #18181b; line-height: 1.6; background-color: #fafafa; padding: 20px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #6366f1; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">maalesef.</h1>
        </div>
        
        <div style="padding: 32px; border: 1px solid #e4e4e7; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h2 style="color: #18181b; margin-top: 0;">Selam ${name},</h2>
          <p><strong>${jobTitle}</strong> başvurunuz değerlendirildi ve sonuç beklediğimiz gibi...</p>
          
          <div style="margin: 32px 0; padding: 24px; background-color: #eef2ff; border-radius: 12px; border-left: 4px solid #6366f1; font-style: italic; color: #3730a3;">
            ${feedback}
          </div>
          
          <p>Üzülme, koleksiyonuna harika bir parça daha ekledin. Yeni başvurular için seni her zaman bekliyoruz.</p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${this.appUrl}" style="display: inline-block; padding: 14px 28px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">Diğer Maalesef'leri Gör</a>
          </div>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e4e4e7;">
            <p style="text-align: center; font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Bu anı ölümsüzleştir</p>
            <div style="text-align: center;">
              <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}" 
                 style="display: inline-block; padding: 8px 16px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 12px; margin: 0 4px;">
                X'te Paylaş
              </a>
              <a href="https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareMessage)}" 
                 style="display: inline-block; padding: 8px 16px; background-color: #0077b5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 12px; margin: 0 4px;">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #71717a; padding-top: 20px;">
          <p>Bu e-posta <strong>maalesef.</strong> uygulaması tarafından otomatik olarak gönderilmiştir.</p>
          <p>Bildirim ayarlarını <a href="${this.appUrl}/profile" style="color: #6366f1; text-decoration: none; font-weight: 500;">profilinden</a> yönetebilirsin.</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        to,
        from: this.from,
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(`Rejection email could not be sent to ${to}`, error);
    }
  }

  private buildNotificationSummaryTemplate(
    name: string,
    unreadCount: number,
    notifications: { title: string; body: string }[],
  ): string {
    const notificationsHtml = notifications
      .map(
        (n) => `
      <div style="margin-bottom: 20px; padding: 15px; background-color: #fafafa; border-radius: 12px; border-left: 4px solid #6366f1; border: 1px solid #e4e4e7; border-left-width: 4px;">
        <h4 style="margin: 0 0 5px 0; color: #18181b; font-size: 16px;">${n.title}</h4>
        <p style="margin: 0; color: #71717a; font-size: 14px;">${n.body}</p>
      </div>
    `,
      )
      .join('');

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

    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #18181b; line-height: 1.6; background-color: #fafafa; padding: 20px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #6366f1; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">maalesef.</h1>
        </div>
        
        <div style="padding: 32px; border: 1px solid #e4e4e7; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h2 style="color: #18181b; margin-top: 0;">Selam ${name},</h2>
          <p style="color: #71717a;">${welcomeMessage}</p>
          
          <div style="margin-top: 30px;">
            ${notificationsHtml}
          </div>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="${this.appUrl}" style="display: inline-block; padding: 14px 28px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">Tüm Detayları Gör</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #71717a; padding-top: 20px;">
          <p>Bu e-posta <strong>maalesef.</strong> uygulaması tarafından otomatik olarak gönderilmiştir.</p>
          <p>Bildirim ayarlarını <a href="${this.appUrl}/profile/settings" style="color: #6366f1; text-decoration: none; font-weight: 500;">ayarlarından</a> yönetebilirsin.</p>
          <p>&copy; ${new Date().getFullYear()} maalesef. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `;
  }

  private buildVerificationTemplate(verificationUrl: string): string {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #18181b; line-height: 1.6; background-color: #fafafa; padding: 20px;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #6366f1; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -1px;">maalesef.</h1>
        </div>
        
        <div style="padding: 32px; border: 1px solid #e4e4e7; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h2 style="color: #18181b; margin-top: 0;">Maalesef'e Hoş Geldin!</h2>
          <p style="color: #71717a;">Hesabını doğrulamak için aşağıdaki butona tıkla.</p>
          <div style="margin: 32px 0; text-align: center;">
            <a
              href="${verificationUrl}"
              style="display: inline-block; padding: 14px 28px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;"
            >E-postamı doğrula</a>
          </div>
          
          <div style="margin-top: 32px; padding: 20px; background-color: #eef2ff; border-radius: 12px; border-left: 4px solid #6366f1;">
            <p style="margin: 0; color: #4338ca; font-weight: bold; font-size: 14px;">Önemli:</p>
            <p style="margin: 4px 0 0 0; color: #4f46e5; font-size: 14px;">
              Mailinizi doğruladıktan sonra bu maili <strong>"spam değil"</strong> olarak işaretleyin ki başvuru sonuçlarınız spam klasörünüze düşüp kaybolmasın.
            </p>
          </div>
  
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e4e4e7;">
            <p style="margin: 0; color: #71717a; font-size: 12px;">Eğer buton çalışmazsa aşağıdaki bağlantıyı tarayıcına kopyala:</p>
            <p style="margin: 8px 0; word-break: break-all; color: #6366f1; font-size: 12px;">${verificationUrl}</p>
            <p style="margin: 0; color: #a1a1aa; font-size: 11px;">Bu bağlantı güvenliğin için sınırlı bir süre geçerlidir.</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #71717a; padding-top: 20px;">
          <p>Bu e-posta <strong>maalesef.</strong> uygulaması tarafından otomatik olarak gönderilmiştir.</p>
          <p>&copy; ${new Date().getFullYear()} maalesef. Tüm hakları saklıdır.</p>
        </div>
      </div>
    `;
  }
}
