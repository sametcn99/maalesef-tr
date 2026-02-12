import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { BadgesService } from './badges.service.js';
import { UsersService } from '../users/users.service.js';
import { BadgeType } from './entities/user-badge.entity.js';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/index.js';

@ApiTags('badges')
@Controller('badges')
export class BadgesController {
  constructor(
    private readonly badgesService: BadgesService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Track a share action and potentially award badges',
  })
  @ApiOkResponse({ description: 'Share tracked and badge checks completed.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Post('track-share')
  async trackShare(@CurrentUser('id') userId: string) {
    const newCount = await this.usersService.incrementShareCount(userId);
    await this.badgesService.checkAndAwardBadges(
      userId,
      BadgeType.SHARE,
      newCount,
    );
    return { success: true, shareCount: newCount };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my badges' })
  @ApiOkResponse({ description: 'Returns authenticated user badges.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyBadges(@CurrentUser('id') userId: string) {
    const badges = await this.badgesService.findByUserId(userId);
    return badges.map((badge) => ({
      name: badge.badgeName,
      type: badge.type,
      earnedAt: badge.createdAt.toISOString(),
    }));
  }
}
