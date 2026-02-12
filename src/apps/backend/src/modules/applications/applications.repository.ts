import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThanOrEqual, Repository } from 'typeorm';
import {
  Application,
  ApplicationStatus,
} from './entities/application.entity.js';

@Injectable()
export class ApplicationsRepository {
  constructor(
    @InjectRepository(Application)
    private readonly repository: Repository<Application>,
  ) {}

  async create(data: Partial<Application>): Promise<Application> {
    const application = this.repository.create(data);
    return this.repository.save(application);
  }

  async findByUserId(userId: string): Promise<Application[]> {
    return this.repository.find({
      where: { userId },
      order: { appliedAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Application | null> {
    return this.repository.findOne({ where: { id } });
  }

  async countByStatus(status?: ApplicationStatus): Promise<number> {
    if (status) {
      return this.repository.count({ where: { status } });
    }
    return this.repository.count();
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async countRejected(): Promise<number> {
    return this.repository.count({
      where: { status: ApplicationStatus.REJECTED },
    });
  }

  async findDueForEvaluation(now: Date, limit = 25): Promise<Application[]> {
    return this.repository.find({
      where: [
        {
          status: ApplicationStatus.PENDING,
          feedback: IsNull(),
          evaluationDueAt: LessThanOrEqual(now),
          nextEvaluationAt: IsNull(),
        },
        {
          status: ApplicationStatus.PENDING,
          feedback: IsNull(),
          nextEvaluationAt: LessThanOrEqual(now),
        },
      ],
      order: { appliedAt: 'ASC' },
      take: limit,
    });
  }

  async save(application: Application): Promise<Application> {
    return this.repository.save(application);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repository.count({ where: { userId } });
  }

  async countRejectedByUserId(userId: string): Promise<number> {
    return this.repository.count({
      where: { userId, status: ApplicationStatus.REJECTED },
    });
  }

  async findLatestByUserId(userId: string): Promise<Application | null> {
    return this.repository.findOne({
      where: { userId },
      order: { appliedAt: 'DESC' },
    });
  }

  async findLatestRejectedByUserId(
    userId: string,
  ): Promise<Application | null> {
    return this.repository.findOne({
      where: { userId, status: ApplicationStatus.REJECTED },
      order: { updatedAt: 'DESC' },
    });
  }
}
