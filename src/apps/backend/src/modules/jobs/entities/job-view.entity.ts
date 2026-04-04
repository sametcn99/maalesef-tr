import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { Job } from './job.entity.js';

@Index('IDX_job_views_job_id', ['jobId'])
@Index('IDX_job_views_user_last_viewed_at', ['userId', 'lastViewedAt'])
@Index('UQ_job_views_user_job', ['userId', 'jobId'], { unique: true })
@Entity('job_views')
export class JobView extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'uuid' })
  jobId!: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  lastViewedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;

  @ManyToOne(() => Job, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job!: Relation<Job>;
}
