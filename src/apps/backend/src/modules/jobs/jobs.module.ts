import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity.js';
import { JobsController } from './jobs.controller.js';
import { JobsService } from './jobs.service.js';
import { JobsRepository } from './jobs.repository.js';
import { UsersModule } from '../users/users.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { BadgesModule } from '../badges/badges.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    UsersModule,
    NotificationsModule,
    BadgesModule,
  ],
  controllers: [JobsController],
  providers: [JobsService, JobsRepository],
  exports: [JobsService],
})
export class JobsModule {}
