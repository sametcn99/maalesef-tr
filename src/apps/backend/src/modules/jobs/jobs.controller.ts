import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import { CreateJobDto } from './dto/index.js';
import { Public } from '../auth/decorators/index.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @ApiOperation({ summary: 'List all job postings' })
  @ApiOkResponse({ description: 'Returns all jobs.' })
  @Get()
  async findAll() {
    return this.jobsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my job postings' })
  @ApiOkResponse({ description: 'Returns jobs created by authenticated user.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get('mine')
  async findMine(@CurrentUser('id') userId: string) {
    return this.jobsService.findMine(userId);
  }

  @Public()
  @ApiOperation({ summary: 'Get a job by id or slug' })
  @ApiParam({
    name: 'idOrSlug',
    description: 'Job UUID or slug value',
    type: String,
  })
  @ApiOkResponse({ description: 'Returns a single job.' })
  @Get(':idOrSlug')
  async findOne(@Param('idOrSlug') idOrSlug: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(idOrSlug)) {
      return this.jobsService.findById(idOrSlug);
    }
    return this.jobsService.findBySlug(idOrSlug);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new job posting' })
  @ApiBody({ type: CreateJobDto })
  @ApiCreatedResponse({ description: 'Job created successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateJobDto, @CurrentUser('id') userId: string) {
    return this.jobsService.create(dto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a job posting by id' })
  @ApiParam({ name: 'id', description: 'Job id', type: String })
  @ApiNoContentResponse({ description: 'Job deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.jobsService.delete(id, userId);
  }
}
