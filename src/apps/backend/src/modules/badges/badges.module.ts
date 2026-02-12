import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBadge } from './entities/user-badge.entity.js';
import { BadgesService } from './badges.service.js';
import { BadgesRepository } from './badges.repository.js';
import { BadgesController } from './badges.controller.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserBadge]),
    NotificationsModule,
    forwardRef(() => UsersModule),
  ],
  providers: [BadgesService, BadgesRepository],
  controllers: [BadgesController],
  exports: [BadgesService],
})
export class BadgesModule {}
