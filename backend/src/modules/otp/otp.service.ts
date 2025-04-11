import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomInt } from 'crypto';
import { Novu } from '@novu/node';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { OTP_REPOSITORY } from '@common/constants';
import { IOtpRepository } from './repositories/otp.repository.interface';
import { Otp } from 'database/entities/otp.entity';
import { OtpStatus } from '@common/enums';

@Injectable()
export class OtpService {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: IOtpRepository,
  ) {}

  async createOtp(phone: string): Promise<Otp> {
    const code = this.generateOtpCode();

    const newOtp = this.otpRepository.create({
      phone,
      code,
      status: OtpStatus.Pending,
      attempts: 0,
      resendCount: 0,
    });

    return this.otpRepository.save(newOtp);
  }

  async verifyOtpCode(phone: string, inputCode: string): Promise<OtpStatus> {
    const otp = await this.findActiveOtpByPhone(phone);

    if (!otp) {
      throw new BadRequestException('OTP không tồn tại hoặc đã hết hạn.');
    }

    if (otp.status === OtpStatus.Blocked) return OtpStatus.Blocked;

    if (otp.code !== inputCode) {
      otp.attempts++;
      if (otp.attempts >= 3) {
        otp.status = OtpStatus.Blocked;
      }
      await this.otpRepository.save(otp);
      return otp.status;
    }

    otp.status = OtpStatus.Verified;
    await this.otpRepository.save(otp);
    return otp.status;
  }

  async renewOrCreateOtp(phone: string): Promise<Otp> {
    let otp = await this.findActiveOtpByPhone(phone);

    const newCode = this.generateOtpCode();

    if (otp) {
      otp.code = newCode;
      otp.status = OtpStatus.Pending;
      otp.attempts = 0;
      otp.resendCount = (otp.resendCount || 0) + 1;
    } else {
      otp = this.otpRepository.create({
        phone,
        code: newCode,
        status: OtpStatus.Pending,
        attempts: 0,
        resendCount: 1,
      });
    }

    return this.otpRepository.save(otp);
  }

  async sendOtpToPhone(phone: string, otp: string): Promise<void> {
    // Tích hợp SMS provider ở đây (Novu, Twilio,...)
    console.log(`[OTP] Gửi OTP tới ${phone}: ${otp}`);
  }

  private generateOtpCode(): string {
    return randomInt(100000, 999999).toString();
  }

  private async findActiveOtpByPhone(phone: string): Promise<Otp | null> {
    return this.otpRepository.findOtpActiveByPhone(phone);
  }
}

