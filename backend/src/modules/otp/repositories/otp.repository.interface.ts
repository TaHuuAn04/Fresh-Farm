import { Otp } from 'database/entities/otp.entity';

export interface IOtpRepository {
  create(data: Partial<Otp>): Otp;
  save(otp: Otp): Promise<Otp>;
  find(): Promise<Otp[]>;
  findOneById(id: string): Promise<Otp | null>;
  findOtpActiveByPhone(phone: string): Promise<Otp | null>;
}
