import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service.js';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'JWT_SECRET',
        'maalesef-secret-key',
      ),
    });
  }

  async validate(payload: JwtPayload) {
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
