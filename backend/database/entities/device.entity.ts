import { DeviceStatus } from '@common/enums';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'devices' })
export class Device extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  key: string;

  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.PA,
  })
  status: DeviceStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.devices, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  owner: User;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;
}
