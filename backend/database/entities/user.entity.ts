// src/user/user.entity.ts
import { UserRole, UserStatus } from '@common/enums';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Device } from './device.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  fullName: string;

  @Column({ type: 'int', nullable: false })
  age: number;

  @Column({ type: 'varchar', length: 10, unique: true, nullable: false })
  phoneNumber: string;

  @Column({ type: 'varchar', nullable: false })
  password: string | undefined;

  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Pending,
    nullable: false,
  })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastTimeBlocked: Date | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
    nullable: false,
  })
  role: UserRole;

  @OneToMany(() => Device, device => device.owner)
  devices: Device[];
}
