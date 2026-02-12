import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBadge } from './entities/user-badge.entity.js';

@Injectable()
export class BadgesRepository {
  constructor(
    @InjectRepository(UserBadge)
    private readonly repository: Repository<UserBadge>,
  ) {}

  async create(data: Partial<UserBadge>): Promise<UserBadge> {
    const badge = this.repository.create(data);
    return this.repository.save(badge);
  }

  async findByUserId(userId: string): Promise<UserBadge[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findSpecificBadge(
    userId: string,
    badgeName: string,
  ): Promise<UserBadge | null> {
    return this.repository.findOne({
      where: { userId, badgeName },
    });
  }
}
