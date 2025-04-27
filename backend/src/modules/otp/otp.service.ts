import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { randomInt } from 'crypto';
import { OtpStatus } from '@common/enums';
import { OTP_TTL } from '@common/constants';
import { AppError } from '@common/dtos/errorResponse.dto';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async createOtp(phone: string): Promise<string> {
    const code = this.generateOtpCode();

    const otpData = {
      code,
      status: OtpStatus.Pending,
      attempts: 0,
      resendCount: 0,
    };

    await this.cacheManager.set(`otp:${phone}`, otpData);

    return code;
  }

  async verifyOtpCode(phone: string, inputCode: string) {
    const otp = await this.cacheManager.get<{
      code: string;
      status: OtpStatus;
      attempts: number;
      resendCount: number;
    }>(`otp:${phone}`);

    if (!otp) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "OTP không tồn tại hoặc đã hết hạn.",
        "OTP_NOT_FOUND"
      )
    }

    if (otp.status === OtpStatus.Blocked) return OtpStatus.Blocked;

    if (otp.code !== inputCode) {
      otp.attempts++;
      if (otp.attempts >= 3) {
        otp.status = OtpStatus.Blocked;
      }
      await this.cacheManager.set(`otp:${phone}`, otp, OTP_TTL);
      return otp.status;
    }

    otp.status = OtpStatus.Verified;
    await this.cacheManager.set(`otp:${phone}`, otp, OTP_TTL);
    return otp.status;
  }

  async renewOrCreateOtp(phone: string): Promise<string> {
    let otp = await this.cacheManager.get<{
      code: string;
      status: OtpStatus;
      attempts: number;
      resendCount: number;
    }>(`otp:${phone}`);

    const newCode = this.generateOtpCode();

    if (otp) {
      otp.code = newCode;
      otp.status = OtpStatus.Pending;
      otp.attempts = 0;
      otp.resendCount = (otp.resendCount || 0) + 1;
    } else {
      otp = {
        code: newCode,
        status: OtpStatus.Pending,
        attempts: 0,
        resendCount: 1,
      };
    }

    const result = await this.cacheManager.set(`otp:${phone}`, otp, OTP_TTL);

    return newCode;
  }

  async sendOtpToPhone(phone: string, otp: string): Promise<void> {
    // Tích hợp SMS provider ở đây (Novu, Twilio,...)
    this.logger.log(`[OTP] Gửi OTP tới ${phone}: ${otp}`);
  }

  private generateOtpCode(): string {
    return randomInt(100000, 999999).toString();
  }
}
