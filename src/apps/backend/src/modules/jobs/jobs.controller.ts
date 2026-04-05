import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service.js';
import {
  CreateJobDto,
  GetJobsQueryDto,
  JOB_INTERACTION_FILTER_VALUES,
  JOB_SORT_VALUES,
} from './dto/index.js';
import { Public } from '../auth/decorators/index.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @ApiOperation({ summary: 'List job postings with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'company', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: JOB_SORT_VALUES,
  })
  @ApiOkResponse({ description: 'Returns paginated jobs.' })
  @Get()
  async findAll(@Query() query: GetJobsQueryDto) {
    return this.jobsService.findAll(query);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List personalized job feed with pagination and filters',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'company', required: false, type: String })
  @ApiQuery({ name: 'location', required: false, type: String })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: JOB_SORT_VALUES,
  })
  @ApiQuery({
    name: 'applied',
    required: false,
    enum: JOB_INTERACTION_FILTER_VALUES,
  })
  @ApiQuery({
    name: 'viewed',
    required: false,
    enum: JOB_INTERACTION_FILTER_VALUES,
  })
  @ApiOkResponse({ description: 'Returns personalized paginated jobs.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get('feed')
  async findFeed(
    @CurrentUser('id') userId: string,
    @Query() query: GetJobsQueryDto,
  ) {
    return this.jobsService.findFeed(userId, query);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my job postings' })
  @ApiOkResponse({ description: 'Returns jobs created by authenticated user.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get('mine')
  async findMine(@CurrentUser('id') userId: string) {
    return this.jobsService.findMine(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List viewed job postings of authenticated user' })
  @ApiOkResponse({ description: 'Returns viewed jobs of authenticated user.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get('viewed')
  async findViewed(@CurrentUser('id') userId: string) {
    return this.jobsService.findViewedByUser(userId);
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
  @ApiOperation({ summary: 'Mark a job posting as viewed' })
  @ApiParam({ name: 'id', description: 'Job id', type: String })
  @ApiNoContentResponse({ description: 'Job view recorded successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Post(':id/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  async trackView(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.jobsService.trackView(id, userId);
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
