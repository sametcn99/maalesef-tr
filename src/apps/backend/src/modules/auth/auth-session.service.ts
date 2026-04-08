import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import type { JwtPayload } from './strategies/jwt.strategy.js';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

@Injectable()
export class AuthSessionService {
  constructor(private readonly usersService: UsersService) {}

  async validateAccessTokenPayload(
    payload: JwtPayload,
  ): Promise<AuthenticatedUser> {
    const user = await this.usersService
      .findById(payload.sub)
      .catch(() => null);

    if (!user) {
      throw new UnauthorizedException('Oturumunuzun süresi doldu.');
    }

    const changedAtSeconds = user.lastPasswordChangedAt
      ? Math.floor(user.lastPasswordChangedAt.getTime() / 1000)
      : null;

    if (changedAtSeconds && payload.iat && payload.iat < changedAtSeconds) {
      throw new UnauthorizedException('Oturumunuzun süresi doldu.');
    }

    return { id: payload.sub, email: payload.email };
  }
}
