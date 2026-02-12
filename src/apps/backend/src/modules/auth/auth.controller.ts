import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { Throttle } from '@nestjs/throttler';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service.js';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ChangePasswordDto,
  UpdateSettingsDto,
  DeleteAccountDto,
} from './dto/index.js';
import { Public, CurrentUser } from './decorators/index.js';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ description: 'User registered successfully.' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return {
      user: result.user,
      accessToken: result.accessToken,
      message: result.message,
    };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful.' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Verify email with code' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiOkResponse({ description: 'Email verified successfully.' })
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyEmail(dto);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return {
      user: result.user,
      accessToken: result.accessToken,
      message: result.message,
    };
  }

  @Public()
  @ApiOperation({ summary: 'Verify email using token link and redirect' })
  @ApiParam({
    name: 'token',
    description: 'Email verification token',
    type: String,
  })
  @ApiNoContentResponse({
    description: 'Redirects to frontend after successful verification.',
  })
  @Get('verify-email/:token')
  async verifyEmailByLink(@Param('token') token: string, @Res() res: Response) {
    const result = await this.authService.verifyEmailByToken(token);
    this.setRefreshTokenCookie(res, result.refreshToken);
    const frontendUrl = this.configService.getOrThrow<string>('CORS_ORIGIN');
    return res.redirect(frontendUrl);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token using refresh token cookie' })
  @ApiOkResponse({ description: 'Access token refreshed successfully.' })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token.' })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @CurrentUser() user: { id: string; email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refresh(user.id, user.email);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return { accessToken: result.accessToken };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiOkResponse({ description: 'User logged out successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('refreshToken', {
      path: '/api/auth',
    });
    return { message: 'Başarıyla çıkış yapıldı.' };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiOkResponse({ description: 'Verification email resent successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@CurrentUser('id') userId: string) {
    return this.authService.resendVerificationEmail(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiOkResponse({ description: 'Returns user profile.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete authenticated user account' })
  @ApiBody({ type: DeleteAccountDto })
  @ApiOkResponse({ description: 'Account deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Delete('account')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @CurrentUser('id') userId: string,
    @Body() dto: DeleteAccountDto,
  ) {
    return this.authService.deleteAccount(userId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change authenticated user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({ description: 'Password changed successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update authenticated user settings' })
  @ApiBody({ type: UpdateSettingsDto })
  @ApiOkResponse({ description: 'Settings updated successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @Patch('settings')
  @HttpCode(HttpStatus.OK)
  async updateSettings(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.authService.updateSettings(userId, dto);
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
