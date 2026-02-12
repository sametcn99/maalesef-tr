import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity.js';
import {
  Application,
  ApplicationStatus,
} from '../applications/entities/application.entity.js';

@Injectable()
export class JobsRepository {
  constructor(
    @InjectRepository(Job)
    private readonly repository: Repository<Job>,
  ) {}

  async create(data: Partial<Job>): Promise<Job> {
    const job = this.repository.create(data);
    const saved = await this.repository.save(job);
    return this.findById(saved.id) as Promise<Job>;
  }

  async findAll(): Promise<Job[]> {
    return this.repository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.createdBy', 'user')
      .leftJoin('job.applications', 'application')
      .select(['job', 'user.id', 'user.name', 'user.email', 'user.slug'])
      .addSelect('COUNT(application.id)', 'job_applicantCount')
      .groupBy('job.id')
      .addGroupBy('user.id')
      .orderBy('job.createdAt', 'DESC')
      .loadRelationCountAndMap('job.applicantCount', 'job.applications')
      .getMany();
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
}
