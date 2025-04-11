import { OtpStatus } from '@common/enums';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('otp')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phone: string;

  @Column()
  code: string;

  @Column({ default: 0 })
  attempts: number; // số lần nhập sai

  @Column({
    type: 'enum',
    enum: OtpStatus,
    default: OtpStatus.Pending,
  })
  status: OtpStatus;

  @Column({ default: 0 })
  resendCount: number; // số lần gửi lại OTP

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
