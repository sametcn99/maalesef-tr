import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository.js';
import { NotificationsGateway } from './notifications.gateway.js';
import type { NotificationEntity } from './entities/notification.entity.js';

interface CreateNotificationInput {
  title: string;
  body: string;
  shareable?: boolean;
  type?: string;
  priority?: number;
}

export interface NotificationView {
  id: string;
  title: string;
  body: string;
  read: boolean;
  shareable: boolean;
  createdAt: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(userId: string, input: CreateNotificationInput) {
    const notification = await this.notificationsRepository.create({
      userId,
      title: input.title,
      body: input.body,
      read: false,
      shareable: input.shareable || false,
      type: input.type || 'info',
      priority: input.priority || 0,
    });

    const serializedNotification = this.serializeNotification(notification);
    this.notificationsGateway.emitCreated(userId, serializedNotification);

    return serializedNotification;
  }

  async findByUserId(userId: string) {
    const notifications =
      await this.notificationsRepository.findByUserId(userId);

    return notifications.map((notification) =>
      this.serializeNotification(notification),
    );
  }

  async markAsRead(id: string, userId: string) {
    await this.notificationsRepository.markAsRead(id, userId);
  }

  async markAllAsRead(userId: string) {
    await this.notificationsRepository.markAllAsRead(userId);
  }

  private serializeNotification(
    notification: NotificationEntity,
  ): NotificationView {
    return {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      read: notification.read,
      shareable: notification.shareable,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
