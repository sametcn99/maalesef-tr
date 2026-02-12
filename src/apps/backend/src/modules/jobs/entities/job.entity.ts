import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/base.entity.js';
import { Application } from '../../applications/entities/application.entity.js';
import { User } from '../../users/entities/user.entity.js';

export interface JobQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  required: boolean;
}

@Entity('jobs')
export class Job extends AppBaseEntity {
  @Column({ length: 255 })
  title!: string;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: true })
  slug!: string | null;

  @Column({ length: 255 })
  company!: string;

  @Column({ length: 255 })
  location!: string;

  @Column({ type: 'text' })
  shortDescription!: string;

  @Column({ type: 'text' })
  fullDescription!: string;

  @Column({ type: 'jsonb', default: [] })
  requirements!: string[];

  @Column({ type: 'jsonb', default: [] })
  questions!: JobQuestion[];

  @OneToMany(() => Application, (application) => application.job)
  applications!: Relation<Application>[];

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy?: Relation<User> | null;

  @Column({ nullable: true })
  createdById?: string | null;
}
