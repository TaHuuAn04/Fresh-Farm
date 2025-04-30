// src/user/user.entity.ts
import { UserRole, UserStatus } from '@common/enums';
import { Entity, Column, OneToMany } from 'typeorm';
import { Device } from './device.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  fullName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  phoneNumber: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Pending,
  })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastTimeBlocked: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @OneToMany(() => Device, (device) => device.owner)
  devices: Device[];

  @Column({ type: 'varchar', length: 255, unique: true, nullable: true })
  email: string;
}
