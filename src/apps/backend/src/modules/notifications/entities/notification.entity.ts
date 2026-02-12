import { Entity, Column, ManyToOne, JoinColumn, type Relation } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('notifications')
export class NotificationEntity extends AppBaseEntity {
  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ default: false })
  read!: boolean;

  @Column({ default: false })
  shareable!: boolean;

  @Column({ type: 'varchar', length: 50, default: 'info' })
  type!: string;

  @Column({ type: 'int', default: 0 })
  priority!: number;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: Relation<User>;
}
