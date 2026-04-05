import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, type SelectQueryBuilder } from 'typeorm';
import { Job } from './entities/job.entity.js';
import { JobView } from './entities/job-view.entity.js';
import {
  Application,
  ApplicationStatus,
} from '../applications/entities/application.entity.js';
import type {
  JobInteractionFilterValue,
  JobSortValue,
} from './dto/get-jobs-query.dto.js';

export interface ViewedJobRecord {
  jobId: string;
  lastViewedAt: Date;
}

export interface JobsListFilters {
  page: number;
  limit: number;
  search?: string;
  company?: string;
  location?: string;
  sort: JobSortValue;
  applied: JobInteractionFilterValue;
  viewed: JobInteractionFilterValue;
  userId?: string;
}

export interface JobsListResult {
  items: Job[];
  total: number;
}

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job)
    private readonly repository: Repository<Job>,
    @InjectRepository(JobView)
    private readonly jobViewRepository: Repository<JobView>,
  ) {}

  async create(data: Partial<Job>): Promise<Job> {
    const job = this.repository.create(data);
    const saved = await this.repository.save(job);
    return this.findById(saved.id) as Promise<Job>;
  }

  async findAll(filters: JobsListFilters): Promise<JobsListResult> {
    const total = await this.countAll(filters);

    const listQuery = this.createListQuery(filters)
      .offset((filters.page - 1) * filters.limit)
      .limit(filters.limit);

    const { entities, raw } = await listQuery.getRawAndEntities();
    const rawRows = raw as Array<Record<string, unknown>>;

    return {
      items: this.mapListItems(entities, rawRows),
      total,
    };
  }

  async findById(id: string): Promise<Job | null> {
    return this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.createdBy', 'user')
      .leftJoin('job.applications', 'application')
      .select(['job', 'user.id', 'user.name', 'user.email', 'user.slug'])
      .addSelect('COUNT(application.id)', 'job_applicantCount')
      .where('job.id = :id', { id })
      .groupBy('job.id')
      .addGroupBy('user.id')
      .loadRelationCountAndMap('job.applicantCount', 'job.applications')
      .getOne();
  }

  async findBySlug(slug: string): Promise<Job | null> {
    return this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.createdBy', 'user')
      .leftJoin('job.applications', 'application')
      .select(['job', 'user.id', 'user.name', 'user.email', 'user.slug'])
      .addSelect('COUNT(application.id)', 'job_applicantCount')
      .where('job.slug = :slug', { slug })
      .groupBy('job.id')
      .addGroupBy('user.id')
      .loadRelationCountAndMap('job.applicantCount', 'job.applications')
      .getOne();
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findApplicantsNeedingNotification(jobId: string) {
    return this.repository.manager
      .getRepository(Application)
      .createQueryBuilder('application')
      .select([
        'application.userId AS "userId"',
        'application.jobTitle AS "jobTitle"',
      ])
      .where('application.jobId = :jobId', { jobId })
      .andWhere('application.feedback IS NULL')
      .andWhere('application.status = :status', {
        status: ApplicationStatus.PENDING,
      })
      .getRawMany<{ userId: string; jobTitle: string }>();
  }

  async findMineWithCounts(userId: string): Promise<Job[]> {
    return this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.createdBy', 'user')
      .leftJoin('job.applications', 'application')
      .select(['job', 'user.id', 'user.name', 'user.email', 'user.slug'])
      .addSelect('COUNT(application.id)', 'job_applicantCount')
      .where('job.createdById = :userId', { userId })
      .groupBy('job.id')
      .addGroupBy('user.id')
      .orderBy('job.createdAt', 'DESC')
      .loadRelationCountAndMap('job.applicantCount', 'job.applications')
      .getMany();
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete({ id });
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { createdById: userId } });
  }

  private async countAll(filters: JobsListFilters): Promise<number> {
    const row = await this.createCountQuery(filters)
      .select('COUNT(job.id)', 'total')
      .getRawOne<{ total: string | number }>();

    return Number(row?.total ?? 0);
  }

  private createCountQuery(filters: JobsListFilters): SelectQueryBuilder<Job> {
    const query = this.repository.createQueryBuilder('job');
    this.applyFilters(query, filters);
    return query;
  }

  private createListQuery(filters: JobsListFilters): SelectQueryBuilder<Job> {
    const query = this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.createdBy', 'user')
      .select(['job', 'user.id', 'user.name', 'user.email', 'user.slug'])
      .addSelect(this.buildApplicantCountSubquery(), 'job_applicantCount');

    if (filters.userId) {
      query
        .setParameter('interactionUserId', filters.userId)
        .addSelect(
          `CASE WHEN EXISTS (${this.buildAppliedExistsSubquery(query)}) THEN true ELSE false END`,
          'job_isApplied',
        )
        .addSelect(
          `CASE WHEN EXISTS (${this.buildViewedExistsSubquery(query)}) THEN true ELSE false END`,
          'job_isViewed',
        );
    }

    this.applyFilters(query, filters);
    this.applySorting(query, filters.sort);

    return query;
  }

  private applyFilters(
    query: SelectQueryBuilder<Job>,
    filters: JobsListFilters,
  ): void {
    if (filters.search) {
      const searchTerm = filters.search.trim();
      const search = `%${searchTerm}%`;
      const useTrigramFallback = searchTerm.length >= 3;

      query.andWhere(
        new Brackets((where) => {
          where
            .where('job.title ILIKE :search', { search })
            .orWhere('job.company ILIKE :search', { search })
            .orWhere('job.location ILIKE :search', { search })
            .orWhere('job.shortDescription ILIKE :search', { search })
            .orWhere(
              `${this.buildSearchDocumentExpression('job')} @@ plainto_tsquery('simple', :searchQuery)`,
              {
                searchQuery: searchTerm,
              },
            );

          if (useTrigramFallback) {
            where
              .orWhere('job.title % :searchTerm', { searchTerm })
              .orWhere('job.company % :searchTerm', { searchTerm })
              .orWhere('job.location % :searchTerm', { searchTerm });
          }
        }),
      );
    }

    if (filters.company) {
      query.andWhere('job.company ILIKE :company', {
        company: `%${filters.company}%`,
      });
    }

    if (filters.location) {
      query.andWhere('job.location ILIKE :location', {
        location: `%${filters.location}%`,
      });
    }

    if (!filters.userId) {
      return;
    }

    query.setParameter('interactionUserId', filters.userId);

    if (filters.applied !== 'all') {
      const appliedExists = this.buildAppliedExistsSubquery(query);

      query.andWhere(
        filters.applied === 'only'
          ? `EXISTS (${appliedExists})`
          : `NOT EXISTS (${appliedExists})`,
      );
    }

    if (filters.viewed !== 'all') {
      const viewedExists = this.buildViewedExistsSubquery(query);

      query.andWhere(
        filters.viewed === 'only'
          ? `EXISTS (${viewedExists})`
          : `NOT EXISTS (${viewedExists})`,
      );
    }
  }

  private applySorting(
    query: SelectQueryBuilder<Job>,
    sort: JobSortValue,
  ): void {
    switch (sort) {
      case 'oldest':
        query.orderBy('job.createdAt', 'ASC').addOrderBy('job.id', 'ASC');
        return;
      case 'most_applied':
        query
          .orderBy('job_applicantCount', 'DESC')
          .addOrderBy('job.createdAt', 'DESC')
          .addOrderBy('job.id', 'DESC');
        return;
      case 'title_asc':
        query
          .orderBy('job.title', 'ASC')
          .addOrderBy('job.createdAt', 'DESC')
          .addOrderBy('job.id', 'DESC');
        return;
      case 'title_desc':
        query
          .orderBy('job.title', 'DESC')
          .addOrderBy('job.createdAt', 'DESC')
          .addOrderBy('job.id', 'DESC');
        return;
      case 'company_asc':
        query
          .orderBy('job.company', 'ASC')
          .addOrderBy('job.createdAt', 'DESC')
          .addOrderBy('job.id', 'DESC');
        return;
      case 'company_desc':
        query
          .orderBy('job.company', 'DESC')
          .addOrderBy('job.createdAt', 'DESC')
          .addOrderBy('job.id', 'DESC');
        return;
      case 'newest':
      default:
        query.orderBy('job.createdAt', 'DESC').addOrderBy('job.id', 'DESC');
    }
  }

  private buildApplicantCountSubquery(): string {
    return this.repository
      .createQueryBuilder('job')
      .subQuery()
      .select('COUNT(application.id)')
      .from(Application, 'application')
      .where('application.jobId = job.id')
      .getQuery();
  }

  private buildSearchDocumentExpression(alias: string): string {
    return `to_tsvector('simple', coalesce(${alias}.title, '') || ' ' || coalesce(${alias}.company, '') || ' ' || coalesce(${alias}.location, '') || ' ' || coalesce(${alias}.shortDescription, '') || ' ' || coalesce(${alias}.fullDescription, ''))`;
  }

  private buildAppliedExistsSubquery(query: SelectQueryBuilder<Job>): string {
    return query
      .subQuery()
      .select('1')
      .from(Application, 'application')
      .where('application.jobId = job.id')
      .andWhere('application.userId = :interactionUserId')
      .getQuery();
  }

  private buildViewedExistsSubquery(query: SelectQueryBuilder<Job>): string {
    return query
      .subQuery()
      .select('1')
      .from(JobView, 'jobView')
      .where('jobView.jobId = job.id')
      .andWhere('jobView.userId = :interactionUserId')
      .getQuery();
  }

  private mapListItems(
    items: Job[],
    raw: Array<Record<string, unknown>>,
  ): Job[] {
    return items.map((job, index) => {
      const currentRaw = raw[index] ?? {};

      job.applicantCount = Number(currentRaw.job_applicantCount ?? 0);

      if (currentRaw.job_isApplied !== undefined) {
        job.isApplied = this.parseBoolean(currentRaw.job_isApplied);
      }

      if (currentRaw.job_isViewed !== undefined) {
        job.isViewed = this.parseBoolean(currentRaw.job_isViewed);
      }

      return job;
    });
  }

  private parseBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    if (typeof value === 'string') {
      return value === 'true' || value === 't' || value === '1';
    }

    return false;
  }

  async trackView(userId: string, jobId: string): Promise<void> {
    await this.jobViewRepository.upsert(
      {
        userId,
        jobId,
        lastViewedAt: new Date(),
      },
      ['userId', 'jobId'],
    );
  }

  async findViewedByUser(userId: string): Promise<ViewedJobRecord[]> {
    return this.jobViewRepository
      .createQueryBuilder('jobView')
      .select('jobView.jobId', 'jobId')
      .addSelect('jobView.lastViewedAt', 'lastViewedAt')
      .where('jobView.userId = :userId', { userId })
      .orderBy('jobView.lastViewedAt', 'DESC')
      .getRawMany<ViewedJobRecord>();
  }
}
