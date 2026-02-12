import {
  ApiBearerAuth,
  ApiBody,
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
  Post,
  Delete,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { User } from '../users/entities/user.entity.js';
import { Public } from '../auth/decorators/public.decorator.js';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my profile settings' })
  @ApiOkResponse({
    description: 'Returns authenticated user profile settings.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMySettings(@CurrentUser() user: User) {
    return this.profilesService.getMySettings(user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my profile settings' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bio: { type: 'string', nullable: true },
        visibilitySettings: {
          type: 'object',
          properties: {
            showApplications: { type: 'boolean' },
            showRejections: { type: 'boolean' },
            showRecentActivity: { type: 'boolean' },
            showJobs: { type: 'boolean' },
            showBio: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Profile settings updated successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateSettings(
    @CurrentUser() user: User,
    @Body()
    settings: {
      bio?: string | null;
      visibilitySettings?: Partial<{
        showApplications: boolean;
        showRejections: boolean;
        showRecentActivity: boolean;
        showJobs: boolean;
        showBio: boolean;
      }>;
    },
  ) {
    return this.profilesService.updateSettings(user.id, settings);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enable public profile sharing' })
  @ApiOkResponse({ description: 'Profile sharing enabled.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Post('share')
  enableSharing(@CurrentUser() user: User) {
    return this.profilesService.enableSharing(user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable public profile sharing' })
  @ApiNoContentResponse({ description: 'Profile sharing disabled.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  @Delete('share')
  disableSharing(@CurrentUser() user: User) {
    return this.profilesService.disableSharing(user.id);
  }

  @Public()
  @ApiOperation({ summary: 'Get public profile by slug' })
  @ApiParam({ name: 'slug', description: 'Public profile slug', type: String })
  @ApiOkResponse({ description: 'Returns public profile data.' })
  @Get('public/:slug')
  getPublicProfile(@Param('slug') slug: string) {
    return this.profilesService.getPublicProfile(slug);
  }
}
