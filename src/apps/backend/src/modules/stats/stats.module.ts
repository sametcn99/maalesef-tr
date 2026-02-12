import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller.js';
import { StatsService } from './stats.service.js';
import { ApplicationsModule } from '../applications/applications.module.js';

@Module({
  imports: [ApplicationsModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
