import { Entity, Column, OneToMany, type Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity.js';
import { Application } from '../../applications/entities/application.entity.js';
import { NotificationEntity } from '../../notifications/entities/notification.entity.js';
import { Job } from '../../jobs/entities/job.entity.js';
import { UserBadge } from '../../badges/entities/user-badge.entity.js';

@Entity('users')
export class User extends AppBaseEntity {
  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerifiedAt!: Date | null;

  @Column({ type: 'uuid', unique: true, nullable: true })
  emailVerificationToken!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerificationTokenExpiresAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  emailVerificationLastSentAt!: Date | null;

  @OneToMany(() => Application, (application) => application.user)
  applications!: Relation<Application>[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user)
  notifications!: Relation<NotificationEntity>[];

  @OneToMany(() => Job, (job) => job.createdBy)
  jobs!: Relation<Job>[];

  @OneToMany(() => UserBadge, (badge) => badge.user)
  badges!: Relation<UserBadge>[];

  @Column({ default: 0 })
  shareCount!: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: true })
  slug!: string | null;

  @Column({ type: 'text', nullable: true })
  bio!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  lastNotificationEmailSentAt!: Date | null;

  @Column({ default: true })
  notificationEmailEnabled!: boolean;

  @Column({
    type: 'jsonb',
    default: {
      showApplications: true,
      showRejections: true,
      showRecentActivity: true,
      showJobs: true,
      showBio: true,
      showBadges: true,
    },
  })
  visibilitySettings!: {
    showApplications: boolean;
    showRejections: boolean;
    showRecentActivity: boolean;
    showJobs: boolean;
    showBio: boolean;
    showBadges: boolean;
  };
  @Column({ type: 'text', nullable: true, select: false })
  refreshToken!: string | null;
}
