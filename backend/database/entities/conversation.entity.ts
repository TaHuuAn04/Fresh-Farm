import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from './base.entity';

import { User } from './user.entity';

@Entity()
export class Conversation extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  conversationId: string;

  @Column({ type: 'varchar', length: 255 })
  messageId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
