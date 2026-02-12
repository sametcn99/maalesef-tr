import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller.js';
import { ProfilesService } from './profiles.service.js';
import { UsersModule } from '../users/users.module.js';
import { ApplicationsModule } from '../applications/applications.module.js';
import { JobsModule } from '../jobs/jobs.module.js';
import { BadgesModule } from '../badges/badges.module.js';

@Module({
  imports: [UsersModule, ApplicationsModule, JobsModule, BadgesModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
