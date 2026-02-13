import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DEV_INITIAL_DELAY_MS,
  PROD_INITIAL_MAX_DELAY_MS,
} from './common/evaluation-timing.constants.js';
import { ApplicationsRepository } from './applications.repository.js';
import { CreateApplicationDto } from './dto/index.js';
import { JobsService } from '../jobs/jobs.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ApplicationStatus } from './entities/application.entity.js';
import { UsersService } from '../users/users.service.js';
import {
  MILESTONE_MESSAGES,
  RECURRING_MILESTONE_MESSAGES,
  RANDOM_ENCOURAGEMENT_MESSAGES,
} from './common/milestone-messages.js';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly applicationsRepository: ApplicationsRepository,
    private readonly jobsService: JobsService,
    private readonly notificationsService: NotificationsService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    userId: string,
    dto: CreateApplicationDto,
    cvText: string | null,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user.emailVerified) {
      throw new ForbiddenException(
        'E-posta doğrulanmadan iş başvurusu yapamazsınız.',
      );
    }

    // Verify the job exists
    const job = await this.jobsService.findById(dto.jobId);
    if (!job) {
      throw new NotFoundException('İş ilanı bulunamadı.');
    }

    // Validate required questions are answered
    for (const question of job.questions) {
      if (question.required && !dto.answers[question.id]?.trim()) {
        throw new BadRequestException(`"${question.label}" sorusu zorunludur.`);
      }
    }

    const now = new Date();
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    // Prod: initial evaluation is between 0-2 hours, Dev: 5 seconds
    const evaluationDelayMs = isProd
      ? Math.floor(Math.random() * PROD_INITIAL_MAX_DELAY_MS)
      : DEV_INITIAL_DELAY_MS;
    const evaluationAt = new Date(now.getTime() + evaluationDelayMs);

    const application = await this.applicationsRepository.create({
      userId,
      jobId: dto.jobId,
      jobTitle: dto.jobTitle,
      jobSlug: job.slug,
      status: ApplicationStatus.PENDING,
      answers: dto.answers,
      cvText: dto.aiConsent ? cvText : null,
      aiConsent: dto.aiConsent,
      appliedAt: now,
      evaluationDueAt: evaluationAt,
      nextEvaluationAt: evaluationAt,
      evaluationAttempts: 0,
      lastEvaluationError: null,
    });

    // Create notification for the user
    await this.notificationsService.create(userId, {
      title: 'Başvurunuz alındı',
      body: `${dto.jobTitle} pozisyonuna başvurunuz başarıyla alınmıştır. Değerlendirme süreci en geç 2 gün içinde tamamlanacaktır.`,
      type: 'APPLICATION_SUBMITTED',
      priority: 5,
    });

    // Milestone check
    const totalApplications =
      await this.applicationsRepository.countByUserId(userId);
    let milestoneTitle: string | null = null;
    let milestoneBody: string | null = null;

    if (MILESTONE_MESSAGES[totalApplications]) {
      const messages = MILESTONE_MESSAGES[totalApplications];
      milestoneTitle = `Büyük Başarı: ${totalApplications}. Başvuru!`;
      milestoneBody = messages[Math.floor(Math.random() * messages.length)];
    } else if (totalApplications > 10 && totalApplications % 5 === 0) {
      const template =
        RECURRING_MILESTONE_MESSAGES[
          Math.floor(Math.random() * RECURRING_MILESTONE_MESSAGES.length)
        ];
      milestoneTitle = `${totalApplications}. Başvuru Milestone!`;
      milestoneBody = template.replace('{count}', totalApplications.toString());
    } else if (totalApplications > 10) {
      // Randomly send encouragement for non-milestone apps after 10 with 30% chance
      if (Math.random() < 0.3) {
        milestoneTitle = 'Yola Devam!';
        milestoneBody =
          RANDOM_ENCOURAGEMENT_MESSAGES[
            Math.floor(Math.random() * RANDOM_ENCOURAGEMENT_MESSAGES.length)
          ];
      }
    }

    if (milestoneTitle && milestoneBody) {
      await this.notificationsService.create(userId, {
        title: milestoneTitle,
        body: milestoneBody,
        shareable: true,
        type: 'MILESTONE_REACHED',
        priority: 10,
      });
    }

    return {
      id: application.id,
      jobId: application.jobId,
      jobTitle: application.jobTitle,
      status: application.status,
      appliedAt: application.appliedAt.toISOString(),
    };
  }

  async findByUserId(userId: string) {
    const applications = await this.applicationsRepository.findByUserId(userId);

    return applications.map((app) => ({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.jobTitle,
      status: app.status,
      appliedAt: app.appliedAt.toISOString(),
      feedback: app.feedback,
    }));
  }

  async getStats() {
    const totalCount = await this.applicationsRepository.count();
    const rejectedCount = await this.applicationsRepository.countRejected();

    const rejectionRate =
      totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 100; // Satirical default: 100% rejection rate

    return {
      rejectedCount: rejectedCount || 1245892, // Satirical fallback
      rejectionRate: rejectionRate || 100,
      averageTurnaroundTime: 'Birkaç Saat',
    };
  }

  async getUserStats(userId: string) {
    const total = await this.applicationsRepository.countByUserId(userId);
    const rejected =
      await this.applicationsRepository.countRejectedByUserId(userId);
    const latest = await this.applicationsRepository.findLatestByUserId(userId);
    const latestRejected =
      await this.applicationsRepository.findLatestRejectedByUserId(userId);
    return { total, rejected, latest, latestRejected };
  }
}
