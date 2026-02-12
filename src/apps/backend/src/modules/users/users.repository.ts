import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { Job } from '../jobs/entities/job.entity.js';
import {
  Application,
  ApplicationStatus,
} from '../applications/entities/application.entity.js';
import { NotificationEntity } from '../notifications/entities/notification.entity.js';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIdWithRefreshToken(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      select: ['id', 'email', 'refreshToken' as any],
    });
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.repository.findOne({
      where: { emailVerificationToken: token },
    });
  }

  async markEmailVerified(userId: string): Promise<User | null> {
    await this.repository.update(userId, {
      emailVerified: true,
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
      emailVerificationTokenExpiresAt: null,
      emailVerificationLastSentAt: null,
    });

    return this.findById(userId);
  }

  async updateVerificationToken(
    userId: string,
    token: string,
    expiresAt: Date,
    sentAt: Date,
  ): Promise<User | null> {
    await this.repository.update(userId, {
      emailVerificationToken: token,
      emailVerificationTokenExpiresAt: expiresAt,
      emailVerificationLastSentAt: sentAt,
    });

    return this.findById(userId);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.repository.update(userId, { password: hashedPassword });
  }

  async deleteUnverifiedOlderThan(days: number): Promise<number> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('emailVerified = :emailVerified', { emailVerified: false })
      .andWhere('createdAt < :cutoff', { cutoff })
      .execute();

    return result.affected ?? 0;
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.repository.manager.transaction(async (manager) => {
      const pendingApplicants = await manager
        .getRepository(Application)
        .createQueryBuilder('application')
        .innerJoin(Job, 'job', 'job.id = application.jobId')
        .select([
          'application.userId AS "userId"',
          'application.jobTitle AS "jobTitle"',
        ])
        .where('job.createdById = :userId', { userId })
        .andWhere('application.feedback IS NULL')
        .andWhere('application.status = :status', {
          status: ApplicationStatus.PENDING,
        })
        .getRawMany<{ userId: string; jobTitle: string }>();

      if (pendingApplicants.length > 0) {
        await manager.getRepository(NotificationEntity).insert(
          pendingApplicants.map((item) => ({
            userId: item.userId,
            title: 'Başvurduğun ilan silindi',
            body: `${item.jobTitle} ilanı cevap gelmeden yayından kaldırıldı.`,
            read: false,
            shareable: false,
          })),
        );
      }

      // Remove all jobs created by the user; related applications cascade from job -> application
      await manager.getRepository(Job).delete({ createdById: userId });

      // Delete the user; related applications and notifications cascade on FK constraints
      await manager.getRepository(User).delete({ id: userId });
    });
  }

  async findBySlug(slug: string): Promise<User | null> {
    return this.repository.findOne({ where: { slug } });
  }

  async updateSlug(userId: string, slug: string | null): Promise<void> {
    await this.repository.update(userId, { slug });
  }

  async updateVisibilitySettings(
    userId: string,
    settings: Partial<User['visibilitySettings']>,
  ): Promise<void> {
    await this.repository.update(userId, {
      visibilitySettings: settings as User['visibilitySettings'],
    });
  }
  async findBio(userId: string): Promise<string | null> {
    const user = await this.repository.findOne({
      where: { id: userId },
      select: ['bio'],
    });
    return user?.bio ?? null;
  }

  async updateBio(userId: string, bio: string | null): Promise<void> {
    await this.repository.update(userId, { bio });
  }

  async findEligibleForNotificationEmail(): Promise<User[]> {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    return this.repository
      .createQueryBuilder('user')
      .innerJoin('user.notifications', 'notification')
      .where('user.notificationEmailEnabled = :enabled', { enabled: true })
      .andWhere(
        '(user.lastNotificationEmailSentAt IS NULL OR user.lastNotificationEmailSentAt < :twoDaysAgo)',
        { twoDaysAgo },
      )
      .andWhere('notification.read = :read', { read: false })
      .select('user')
      .distinct(true)
      .getMany();
  }

  async updateLastNotificationEmailSentAt(
    userId: string,
    date: Date,
  ): Promise<void> {
    await this.repository.update(userId, { lastNotificationEmailSentAt: date });
  }

  async updateNotificationEmailEnabled(
    userId: string,
    enabled: boolean,
  ): Promise<void> {
    await this.repository.update(userId, { notificationEmailEnabled: enabled });
  }

  async incrementShareCount(userId: string): Promise<number> {
    const user = await this.findById(userId);
    if (!user) return 0;

    const newShareCount = (user.shareCount || 0) + 1;
    await this.repository.update(userId, { shareCount: newShareCount });
    return newShareCount;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    await this.repository.update(userId, { refreshToken });
  }
}
