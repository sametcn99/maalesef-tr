import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { AuthSessionService } from '../auth/auth-session.service.js';
import type { JwtPayload } from '../auth/strategies/jwt.strategy.js';
import type { NotificationView } from './notifications.service.js';

const NOTIFICATIONS_NAMESPACE = '/notifications';

type SocketUser = {
  id: string;
  email: string;
};

type NotificationSocket = Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  { user?: SocketUser }
>;

@WebSocketGateway({ namespace: NOTIFICATIONS_NAMESPACE })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  private server?: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  afterInit(server: Server) {
    server.use((client: NotificationSocket, next) => {
      void (async () => {
        try {
          const user = await this.authenticateClient(client);
          client.data.user = user;
          next();
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'WebSocket yetkilendirmesi başarısız.';

          next(new Error(message));
        }
      })();
    });
  }

  async handleConnection(client: NotificationSocket) {
    const user = client.data.user;

    if (!user) {
      client.disconnect(true);
      return;
    }

    await client.join(this.getUserRoom(user.id));
    this.logger.debug(`Notification socket bağlandı: ${user.id}`);
  }

  handleDisconnect(client: NotificationSocket) {
    const userId = client.data.user?.id;

    if (!userId) {
      return;
    }

    this.logger.debug(`Notification socket ayrıldı: ${userId}`);
  }

  emitCreated(userId: string, notification: NotificationView) {
    this.server
      ?.to(this.getUserRoom(userId))
      .emit('notification.created', notification);
  }

  private getUserRoom(userId: string) {
    return `user:${userId}`;
  }

  private async authenticateClient(
    client: NotificationSocket,
  ): Promise<SocketUser> {
    const token = this.extractToken(client);

    if (!token) {
      throw new Error('Yetkilendirme bilgisi bulunamadı.');
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
    });

    return this.authSessionService.validateAccessTokenPayload(payload);
  }

  private extractToken(client: NotificationSocket): string | null {
    const authToken = client.handshake.auth.token as unknown;

    if (typeof authToken === 'string' && authToken.trim().length > 0) {
      return authToken.replace(/^Bearer\s+/i, '').trim();
    }

    const authorizationHeader = client.handshake.headers.authorization;

    if (typeof authorizationHeader === 'string') {
      return authorizationHeader.replace(/^Bearer\s+/i, '').trim();
    }

    return null;
  }
}
