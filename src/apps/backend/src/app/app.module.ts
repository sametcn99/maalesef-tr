import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from '../modules/auth/auth.module.js';
import { UsersModule } from '../modules/users/users.module.js';
import { JobsModule } from '../modules/jobs/jobs.module.js';
import { ApplicationsModule } from '../modules/applications/applications.module.js';
import { NotificationsModule } from '../modules/notifications/notifications.module.js';
import { StatsModule } from '../modules/stats/stats.module.js';
import { ProfilesModule } from '../modules/profiles/profiles.module.js';
import { BadgesModule } from '../modules/badges/badges.module.js';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard.js';
import { SeedService } from '../database/seed.service.js';

// Entities
import { User } from '../modules/users/entities/user.entity.js';
import { Job } from '../modules/jobs/entities/job.entity.js';
import { Application } from '../modules/applications/entities/application.entity.js';
import { NotificationEntity } from '../modules/notifications/entities/notification.entity.js';
import { UserBadge } from '../modules/badges/entities/user-badge.entity.js';
import { envValidationSchema } from '../common/config/env.validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Job, Application, NotificationEntity, UserBadge],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        migrations: [join(import.meta.dirname, '../database/migrations/*.js')],
        migrationsRun: true,
        logging: configService.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Job,
      Application,
      NotificationEntity,
      UserBadge,
    ]),
    AuthModule,
    UsersModule,
    JobsModule,
    ApplicationsModule,
    NotificationsModule,
    StatsModule,
    ProfilesModule,
    BadgesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
