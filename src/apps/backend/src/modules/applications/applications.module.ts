import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity.js';
import { ApplicationsController } from './applications.controller.js';
import { ApplicationsService } from './applications.service.js';
import { ApplicationsRepository } from './applications.repository.js';
import { JobsModule } from '../jobs/jobs.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { ApplicationsEvaluationService } from './applications.evaluation.service.js';
import { UsersModule } from '../users/users.module.js';
import { MailModule } from '../mail/mail.module.js';
import { BadgesModule } from '../badges/badges.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    JobsModule,
    UsersModule,
    MailModule,
    BadgesModule,
    forwardRef(() => NotificationsModule),
  ],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    ApplicationsRepository,
    ApplicationsEvaluationService,
  ],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
