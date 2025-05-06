import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Severity } from '@common/enums';

@Entity()
export class Notification extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp' })
  time: Date;

  @Column({ type: 'enum', enum: Severity, default: Severity.LOW })
  severity: Severity;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
