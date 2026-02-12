import { Injectable, Logger } from '@nestjs/common';
import { BadgesRepository } from './badges.repository.js';
import { BadgeType, UserBadge } from './entities/user-badge.entity.js';
import { BADGE_DEFINITIONS } from './constants/badge-definitions.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class BadgesService {
  private readonly logger = new Logger(BadgesService.name);

  constructor(
    private readonly badgesRepository: BadgesRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async checkAndAwardBadges(
    userId: string,
    type: BadgeType,
    currentCount: number,
  ) {
    const relevantDefinitions = BADGE_DEFINITIONS.filter(
      (d) => d.type === type && currentCount >= d.threshold,
    );

    const existingBadges = await this.badgesRepository.findByUserId(userId);
    const existingBadgeNames = new Set(existingBadges.map((b) => b.badgeName));

    for (const definition of relevantDefinitions) {
      if (!existingBadgeNames.has(definition.name)) {
        await this.badgesRepository.create({
          userId,
          badgeName: definition.name,
          type: definition.type,
          threshold: definition.threshold,
        });

        await this.notificationsService.create(userId, {
          title: 'Yeni Rozet Kazandın!',
          body: `Tebrikler! "${definition.name}" rozetini kazandın. Profilinde sergileyebilirsin.`,
          shareable: true,
          type: 'BADGE_EARNED',
          priority: 30,
        });

        this.logger.log(`Awarded badge "${definition.name}" to user ${userId}`);
      }
    }
  }

  async findByUserId(userId: string): Promise<UserBadge[]> {
    return this.badgesRepository.findByUserId(userId);
  }
}
