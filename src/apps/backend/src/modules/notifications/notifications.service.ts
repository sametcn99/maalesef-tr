import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository.js';

interface CreateNotificationInput {
  title: string;
  body: string;
  shareable?: boolean;
  type?: string;
  priority?: number;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async create(userId: string, input: CreateNotificationInput) {
    return this.notificationsRepository.create({
      userId,
      title: input.title,
      body: input.body,
      read: false,
      shareable: input.shareable || false,
      type: input.type || 'info',
      priority: input.priority || 0,
    });
  }

  async findByUserId(userId: string) {
    const notifications =
      await this.notificationsRepository.findByUserId(userId);

    return notifications.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      read: n.read,
      shareable: n.shareable,
      createdAt: n.createdAt.toISOString(),
    }));
  }

  async markAsRead(id: string, userId: string) {
    await this.notificationsRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string) {
    await this.notificationsRepository.markAllAsRead(userId);
  }
}
