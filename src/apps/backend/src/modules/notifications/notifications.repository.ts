import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity.js';

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}

  async create(data: Partial<NotificationEntity>): Promise<NotificationEntity> {
    const notification = this.repository.create(data);
    return this.repository.save(notification);
  }

  async findByUserId(userId: string): Promise<NotificationEntity[]> {
    return this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findUnreadForUserIds(userIds: string[]): Promise<NotificationEntity[]> {
    if (userIds.length === 0) {
      return [];
    }

    return this.repository.find({
      where: {
        userId: In(userIds),
        read: false,
      },
      order: {
        userId: 'ASC',
        priority: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async markAsRead(id: string, userId: string): Promise<void> {
    await this.repository.update({ id, userId }, { read: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.repository.update({ userId, read: false }, { read: true });
  }
}
