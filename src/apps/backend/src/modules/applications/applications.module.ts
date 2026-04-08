import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity.js';
import { ApplicationsController } from './applications.controller.js';
import { ApplicationsService } from './applications.service.js';
import { ApplicationsRepository } from './applications.repository.js';
import { JobsModule } from '../jobs/jobs.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { ApplicationsEvaluationService } from './applications.evaluation.service.js';
import { TemplateModule } from '../../common/templates/template.module.js';
import { UsersModule } from '../users/users.module.js';
import { MailModule } from '../mail/mail.module.js';
import { BadgesModule } from '../badges/badges.module.js';
import { ApplicationTemplatesRegistrar } from './application-templates.registrar.js';
import { ApplicationEvaluationAiService } from './application-evaluation-ai.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    JobsModule,
    UsersModule,
    MailModule,
    TemplateModule,
    BadgesModule,
    NotificationsModule,
  ],
  controllers: [ApplicationsController],
  providers: [
    ApplicationTemplatesRegistrar,
    ApplicationEvaluationAiService,
    ApplicationsService,
    ApplicationsRepository,
    ApplicationsEvaluationService,
  ],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
