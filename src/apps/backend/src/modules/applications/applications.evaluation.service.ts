import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { TemplateRendererService } from '../../common/templates/template-renderer.service.js';
import { ApplicationsRepository } from './applications.repository.js';
import {
  Application,
  ApplicationStatus,
} from './entities/application.entity.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { UsersService } from '../users/users.service.js';
import { MailService } from '../mail/mail.service.js';
import { BadgesService } from '../badges/badges.service.js';
import { BadgeType } from '../badges/entities/user-badge.entity.js';
import { JobQuestion } from '../jobs/entities/job.entity.js';
import { ApplicationEvaluationAiService } from './application-evaluation-ai.service.js';
import {
  DEV_CRON_EXPRESSION,
  PROD_CRON_EXPRESSION,
  DEV_RETRY_DELAY_MS,
  PROD_RETRY_MAX_DELAY_MS,
} from './common/evaluation-timing.constants.js';

@Injectable()
export class ApplicationsEvaluationService implements OnModuleInit {
  private readonly logger = new Logger(ApplicationsEvaluationService.name);

  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly badgesService: BadgesService,
    private readonly configService: ConfigService<Record<string, string>>,
    private readonly templateRenderer: TemplateRendererService,
    private readonly applicationEvaluationAiService: ApplicationEvaluationAiService,
  ) {}

  private static readonly CRON_EXPR =
    process.env.NODE_ENV === 'production'
      ? PROD_CRON_EXPRESSION
      : DEV_CRON_EXPRESSION;

  // Cron decorator typing is fine in @nestjs/schedule but ESLint flags it as unsafe; suppress locally.

  @Cron(ApplicationsEvaluationService.CRON_EXPR)
  async handleDueApplications() {
    if (!this.applicationEvaluationAiService.isEnabled()) {
      return; // AI evaluation is disabled
    }

    const now = new Date();
    const dueApplications =
      await this.applicationsRepository.findDueForEvaluation(now, 10);

    for (const application of dueApplications) {
      await this.evaluateApplication(application);
    }
  }

  async onModuleInit() {
    // Run overdue evaluations immediately on startup
    try {
      await this.handleDueApplications();
    } catch (error) {
      // Ignore errors during startup (e.g., tables not yet created)
      this.logger.warn(
        `Could not process due applications on startup: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async evaluateApplication(application: Application) {
    const now = new Date();

    // Skip applications already evaluated or with feedback
    if (
      application.status !== ApplicationStatus.PENDING ||
      application.feedback
    ) {
      return;
    }

    try {
      const prompt = await this.buildPrompt(
        application,
        application.job
          ? {
              title: application.job.title,
              company: application.job.company,
              location: application.job.location,
              fullDescription: application.job.fullDescription,
              requirements: application.job.requirements,
              questions: application.job.questions,
            }
          : undefined,
      );

      const text =
        await this.applicationEvaluationAiService.generateFeedback(prompt);

      if (!text) {
        throw new Error('Model boş yanıt döndürdü');
      }

      application.status = ApplicationStatus.REJECTED;
      application.feedback = text;
      application.evaluationAttempts += 1;
      application.nextEvaluationAt = null;
      application.evaluationDueAt = null;
      application.lastEvaluationError = null;
      // Wipe user-submitted content after rejection while keeping the decision itself
      application.answers = {};
      application.cvText = null;
      application.aiConsent = false;

      await this.applicationsRepository.save(application);

      await this.notificationsService.create(application.userId, {
        title: `${application.jobTitle} başvurusu değerlendirildi`,
        body: text,
        shareable: true,
        type: 'APPLICATION_REJECTED',
        priority: 20,
      });

      // Send instant email for rejection
      const user = await this.usersService.findById(application.userId);
      if (user) {
        await this.mailService.sendRejectionEmail(
          user.email,
          user.name,
          application.jobTitle,
          text,
        );
      }

      // Award rejection badges
      const rejectedCount =
        await this.applicationsRepository.countRejectedByUserId(
          application.userId,
        );
      await this.badgesService.checkAndAwardBadges(
        application.userId,
        BadgeType.REJECTION,
        rejectedCount,
      );
    } catch (error) {
      this.logger.warn(
        `AI değerlendirme başarısız (${application.id}): ${error instanceof Error ? error.message : String(error)}`,
      );

      application.evaluationAttempts += 1;
      application.lastEvaluationError =
        error instanceof Error ? error.message : 'Bilinmeyen hata';
      application.nextEvaluationAt = this.computeRetryTime(now);

      await this.applicationsRepository.save(application);
    }
  }

  private async buildPrompt(
    application: Application,
    job?: {
      title: string;
      company: string;
      location: string;
      fullDescription: string;
      requirements: string[];
      questions: JobQuestion[];
    },
  ) {
    const answersSummary = Object.entries(application.answers || {})
      .map(([key, value]) => `- ${key}: ${this.trimText(String(value), 200)}`)
      .join('\n');

    const requirementsSummary =
      job?.requirements?.map((r) => `- ${this.trimText(r, 160)}`).join('\n') ??
      'Belirtilmedi';

    const cvText = this.trimText(
      application.cvText ?? 'CV metni sağlanmadı.',
      2000,
    );

    const jobIntro = job
      ? `${job.title} @ ${job.company} (${job.location})\n${this.trimText(job.fullDescription, 1200)}`
      : application.jobTitle;

    const [systemPrompt, userPrompt] = await Promise.all([
      this.templateRenderer.renderMarkdown('application-evaluation-system', {}),
      this.templateRenderer.renderMarkdown('application-evaluation-user', {
        jobIntro,
        requirementsSummary,
        answersSummary: answersSummary || 'Yanıt yok',
        cvText,
      }),
    ]);

    return { systemPrompt, userPrompt };
  }

  private trimText(value: string, maxLength: number) {
    const sanitized = value.replace(/\s+/g, ' ').trim();
    if (sanitized.length <= maxLength) {
      return sanitized;
    }
    return `${sanitized.slice(0, maxLength)}…`;
  }

  private computeRetryTime(now: Date) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    if (!isProd) {
      // Dev: retry after 5 seconds
      return new Date(now.getTime() + DEV_RETRY_DELAY_MS);
    }

    // Prod: randomly delay between 0 and 2 hours
    const delayMs = Math.random() * PROD_RETRY_MAX_DELAY_MS;
    return new Date(now.getTime() + delayMs);
  }
}
