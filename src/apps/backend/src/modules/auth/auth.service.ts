import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service.js';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ChangePasswordDto,
  DeleteAccountDto,
} from './dto/index.js';
import { MailService } from '../mail/mail.service.js';

const SALT_ROUNDS = 12;
const EMAIL_VERIFICATION_TTL_MS = 2 * 24 * 60 * 60 * 1000;
const EMAIL_VERIFICATION_RESEND_COOLDOWN_MS = 5 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kullanımda.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const verificationToken = randomUUID();
    const verificationExpiresAt = new Date(
      Date.now() + EMAIL_VERIFICATION_TTL_MS,
    );
    const verificationSentAt = new Date();

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      emailVerified: false,
      emailVerifiedAt: null,
      emailVerificationToken: verificationToken,
      emailVerificationTokenExpiresAt: verificationExpiresAt,
      emailVerificationLastSentAt: verificationSentAt,
    });

    await this.mailService.sendEmailVerification(user.email, verificationToken);

    const { accessToken, refreshToken } = await this.generateAuthTokens(
      user.id,
      user.email,
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      accessToken,
      refreshToken,
      message: 'Doğrulama e-postası gönderildi. Lütfen e-postanı kontrol et.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const { accessToken, refreshToken } = await this.generateAuthTokens(
      user.id,
      user.email,
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(userId: string, email: string) {
    const { accessToken, refreshToken } = await this.generateAuthTokens(
      userId,
      email,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı.');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      notificationEmailEnabled: user.notificationEmailEnabled,
    };
  }

  async updateSettings(
    userId: string,
    dto: { notificationEmailEnabled?: boolean },
  ) {
    if (dto.notificationEmailEnabled !== undefined) {
      await this.usersService.updateNotificationEmailEnabled(
        userId,
        dto.notificationEmailEnabled,
      );
    }

    return {
      message: 'Ayarlar başarıyla güncellendi.',
    };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    return this.verifyEmailByToken(dto.token);
  }

  async verifyEmailByToken(token: string) {
    const user = await this.usersService.findByVerificationToken(token);

    if (user.emailVerified) {
      const { accessToken, refreshToken } = await this.generateAuthTokens(
        user.id,
        user.email,
      );

      return {
        message: 'E-posta zaten doğrulanmış.',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        },
        accessToken,
        refreshToken,
      };
    }

    if (
      !user.emailVerificationTokenExpiresAt ||
      user.emailVerificationTokenExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException(
        'Doğrulama bağlantısının süresi dolmuş. Lütfen yeniden kayıt olun.',
      );
    }

    const verifiedUser = await this.usersService.markEmailVerified(user.id);

    const { accessToken, refreshToken } = await this.generateAuthTokens(
      verifiedUser.id,
      verifiedUser.email,
    );

    return {
      message: 'E-posta başarıyla doğrulandı.',
      user: {
        id: verifiedUser.id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        emailVerified: verifiedUser.emailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.usersService.findById(userId);

    if (user.emailVerified) {
      throw new BadRequestException('E-posta zaten doğrulandı.');
    }

    const lastSent = user.emailVerificationLastSentAt?.getTime();
    if (
      lastSent &&
      Date.now() - lastSent < EMAIL_VERIFICATION_RESEND_COOLDOWN_MS
    ) {
      const remainingSeconds = Math.ceil(
        (EMAIL_VERIFICATION_RESEND_COOLDOWN_MS - (Date.now() - lastSent)) /
          1000,
      );

      throw new BadRequestException(
        `Lütfen ${remainingSeconds} saniye sonra tekrar deneyin.`,
      );
    }

    const verificationToken = randomUUID();
    const verificationExpiresAt = new Date(
      Date.now() + EMAIL_VERIFICATION_TTL_MS,
    );
    const sentAt = new Date();

    await this.usersService.updateVerificationToken(
      user.id,
      verificationToken,
      verificationExpiresAt,
      sentAt,
    );

    await this.mailService.sendEmailVerification(user.email, verificationToken);

    return {
      message: 'Doğrulama e-postası tekrar gönderildi.',
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);

    const isCurrentValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentValid) {
      throw new UnauthorizedException('Mevcut şifre hatalı.');
    }

    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('Yeni şifre mevcut şifre ile aynı olamaz.');
    }

    const hashed = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.usersService.updatePassword(userId, hashed);

    return {
      message: 'Şifreniz başarıyla güncellendi.',
    };
  }

  async deleteAccount(userId: string, dto: DeleteAccountDto) {
    const user = await this.usersService.findById(userId);

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Şifre hatalı.');
    }

    await this.usersService.deleteAccount(userId);

    return {
      message: 'Hesabınız ve tüm verileriniz başarıyla silindi.',
    };
  }

  private async generateAuthTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email },
      {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    await this.usersService.updateRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}
