import { Entity, Column, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity.js';
import { User } from '../../users/entities/user.entity.js';

export enum BadgeType {
  REJECTION = 'REJECTION',
  SHARE = 'SHARE',
  JOB_POST = 'JOB_POST',
}

@Entity('user_badges')
export class UserBadge extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ length: 255 })
  badgeName!: string;

  @Column({
    type: 'enum',
    enum: BadgeType,
  })
  type!: BadgeType;

  @Column({ type: 'int' })
  threshold!: number;

  @ManyToOne(() => User, (user) => user.badges, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;
}
