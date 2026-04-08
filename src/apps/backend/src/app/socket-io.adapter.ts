import { Logger, type INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, type RedisClientType } from 'redis';
import type { Server, ServerOptions } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import {
  createOriginValidator,
  getAllowedOrigins,
} from '../common/config/cors.util.js';

export class AppSocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(AppSocketIoAdapter.name);
  private readonly allowedOrigins: string[];
  private redisAdapterConstructor?: ReturnType<typeof createAdapter>;
  private redisPubClient?: RedisClientType;
  private redisSubClient?: RedisClientType;

  constructor(
    app: INestApplicationContext,
    private readonly configService: ConfigService,
  ) {
    super(app);
    this.allowedOrigins = getAllowedOrigins(
      this.configService.get<string>('CORS_ORIGIN'),
    );
  }

  async connectToRedis(): Promise<void> {
    const redisUrl = this.configService.get<string>('REDIS_URL');

    if (!redisUrl) {
      this.logger.warn(
        'REDIS_URL tanımlı değil. WebSocket yayınları tek instance modunda çalışacak.',
      );
      return;
    }

    this.redisPubClient = createClient({ url: redisUrl });
    this.redisSubClient = this.redisPubClient.duplicate();

    await Promise.all([
      this.redisPubClient.connect(),
      this.redisSubClient.connect(),
    ]);

    this.redisAdapterConstructor = createAdapter(
      this.redisPubClient,
      this.redisSubClient,
    );

    this.logger.log('Socket.IO Redis adapter bağlandı.');
  }

  override createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: createOriginValidator(this.allowedOrigins),
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization', 'Content-Type'],
      },
    }) as Server;

    if (this.redisAdapterConstructor) {
      server.adapter(this.redisAdapterConstructor);
    }

    return server;
  }
}
