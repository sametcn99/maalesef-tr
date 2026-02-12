import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatsService } from './stats.service.js';
import { Public } from '../auth/decorators/index.js';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Public()
  @ApiOperation({ summary: 'Get public platform statistics' })
  @ApiOkResponse({ description: 'Returns aggregate platform statistics.' })
  @Get()
  async getStats() {
    return this.statsService.getStats();
  }
}
