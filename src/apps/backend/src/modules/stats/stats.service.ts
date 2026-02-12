import { Injectable } from '@nestjs/common';
import { ApplicationsService } from '../applications/applications.service.js';

@Injectable()
export class StatsService {
  constructor(private readonly applicationsService: ApplicationsService) {}

  async getStats() {
    return this.applicationsService.getStats();
  }
}
