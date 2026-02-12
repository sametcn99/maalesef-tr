import {
  ApiBearerAuth,
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
  Patch,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { CurrentUser } from '../auth/decorators/index.js';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List my notifications' })
  @ApiOkResponse({ description: 'Returns authenticated user notifications.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get()
  async findAll(@CurrentUser('id') userId: string) {
    return this.notificationsService.findByUserId(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiParam({ name: 'id', description: 'Notification id', type: String })
  @ApiNoContentResponse({ description: 'Notification marked as read.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.notificationsService.markAsRead(id, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiNoContentResponse({ description: 'All notifications marked as read.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@CurrentUser('id') userId: string) {
    await this.notificationsService.markAllAsRead(userId);
  }
}
