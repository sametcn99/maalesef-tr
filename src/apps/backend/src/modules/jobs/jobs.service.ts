import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  JobsRepository,
  type JobsListFilters,
  type ViewedJobRecord,
} from './jobs.repository.js';
import { CreateJobDto, GetJobsQueryDto } from './dto/index.js';
import { Job } from './entities/job.entity.js';
import type { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { BadgesService } from '../badges/badges.service.js';
import { BadgeType } from '../badges/entities/user-badge.entity.js';
import * as crypto from 'crypto';

export interface JobsListResponse {
  items: Job[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

function slugify(text: string): string {
  const trMap: { [key: string]: string } = {
    ç: 'c',
    Ç: 'C',
    ğ: 'g',
    Ğ: 'G',
    ı: 'i',
    İ: 'I',
    ö: 'o',
    Ö: 'O',
    ş: 's',
    Ş: 'S',
    ü: 'u',
    Ü: 'U',
  };
  return text
    .toString()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (match) => trMap[match] || match)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

@Injectable()
export class JobsService {
  constructor(
    private readonly jobsRepository: JobsRepository,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly badgesService: BadgesService,
  ) {}

  async create(dto: CreateJobDto, userId: string): Promise<Job> {
    if (!userId) {
      throw new BadRequestException('İlan oluşturmak için giriş yapmalısınız.');
    }

    const user = await this.usersService.findById(userId);
    if (!user.emailVerified) {
      throw new ForbiddenException(
        'E-posta doğrulanmadan ilan yayınlayamazsınız.',
      );
    }

    const createdBy = { id: userId } as User;
    const randomId = crypto.randomBytes(3).toString('hex');
    const slug = `${slugify(dto.title)}-${randomId}`;

    const job = await this.jobsRepository.create({ ...dto, createdBy, slug });

    // Award job posting badges
    const jobCount = await this.jobsRepository.countByUserId(userId);
    await this.badgesService.checkAndAwardBadges(
      userId,
      BadgeType.JOB_POST,
      jobCount,
    );

    return job;
  }

  async findAll(query: GetJobsQueryDto): Promise<JobsListResponse> {
    return this.listJobs(query);
  }

  async findFeed(
    userId: string,
    query: GetJobsQueryDto,
  ): Promise<JobsListResponse> {
    return this.listJobs(query, userId);
  }

  async findMine(userId: string): Promise<Job[]> {
    return this.jobsRepository.findMineWithCounts(userId);
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobsRepository.findById(id);
    if (!job) {
      throw new NotFoundException('İş ilanı bulunamadı.');
    }
    return job;
  }

  async findBySlug(slug: string): Promise<Job> {
    const job = await this.jobsRepository.findBySlug(slug);
    if (!job) {
      throw new NotFoundException('İş ilanı bulunamadı.');
    }
    return job;
  }

  async count(): Promise<number> {
    return this.jobsRepository.count();
  }

  async trackView(jobId: string, userId: string): Promise<void> {
    await this.findById(jobId);
    await this.jobsRepository.trackView(userId, jobId);
  }

  async findViewedByUser(userId: string): Promise<ViewedJobRecord[]> {
    return this.jobsRepository.findViewedByUser(userId);
  }

  async delete(jobId: string, userId: string): Promise<void> {
    const job = await this.findById(jobId);

    if (job.createdById && job.createdById !== userId) {
      throw new ForbiddenException('Bu ilanı silme yetkiniz yok.');
    }

    const applicants =
      await this.jobsRepository.findApplicantsNeedingNotification(jobId);

    await this.jobsRepository.deleteById(jobId);

    await Promise.all(
      applicants.map((applicant) =>
        this.notificationsService.create(applicant.userId, {
          title: 'Başvurduğun ilan silindi',
          body: `${job.title} ilanı cevap gelmeden yayından kaldırıldı.`,
          shareable: false,
        }),
      ),
    );
  }

  private async listJobs(
    query: GetJobsQueryDto,
    userId?: string,
  ): Promise<JobsListResponse> {
    const filters = this.normalizeListFilters(query, userId);
    const { items, total } = await this.jobsRepository.findAll(filters);
    const totalPages = total > 0 ? Math.ceil(total / filters.limit) : 0;

    return {
      items,
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages,
      hasMore: filters.page * filters.limit < total,
    };
  }

  private normalizeListFilters(
    query: GetJobsQueryDto,
    userId?: string,
  ): JobsListFilters {
    return {
      page: query.page,
      limit: query.limit,
      search: query.search,
      company: query.company,
      location: query.location,
      sort: query.sort,
      applied: userId ? query.applied : 'all',
      viewed: userId ? query.viewed : 'all',
      userId,
    };
  }
}
