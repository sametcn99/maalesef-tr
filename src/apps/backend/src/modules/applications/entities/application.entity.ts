import { Entity, Column, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { Job } from '../../jobs/entities/job.entity.js';

export enum ApplicationStatus {
  PENDING = 'pending',
  REJECTED = 'rejected',
}

@Entity('applications')
export class Application extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  jobId!: string;

  @Column({ length: 255 })
  jobTitle!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  jobSlug!: string | null;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status!: ApplicationStatus;

  @Column({ type: 'jsonb', default: {} })
  answers!: Record<string, string>;

  @Column({ type: 'text', nullable: true })
  cvText!: string | null;

  @Column({ default: false })
  aiConsent!: boolean;

  @Column({ type: 'text', nullable: true })
  feedback!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  evaluationDueAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  nextEvaluationAt!: Date | null;

  @Column({ type: 'int', default: 0 })
  evaluationAttempts!: number;

  @Column({ type: 'text', nullable: true })
  lastEvaluationError!: string | null;

  @Column({ type: 'timestamptz' })
  appliedAt!: Date;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;

  @ManyToOne(() => Job, (job) => job.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job!: Relation<Job>;
}
