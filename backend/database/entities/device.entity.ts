import { DeviceStatus } from '@common/enums';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'devices' })
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  key: string;

  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.PA,
  })
  status: DeviceStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.devices, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  owner: User;

  @Column({ type: 'uuid', nullable: true })
  ownerId: string;
}
