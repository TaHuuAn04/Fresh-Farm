import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { OtpService } from '../otp/otp.service';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { UsersService } from '@modules/users/users.service';
import { OtpStatus, UserStatus } from '@common/enums';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { RequestForgotPasswordDto } from './dtos/request-forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcryptjs';
import { JWT_ACCESS_TOKEN_EXPIRATION_TIME, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_EXPIRATION_TIME, JWT_REFRESH_TOKEN_SECRET } from '@environments';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterDto): Promise<void> {
    await this.usersService.ensurePhoneNumberNotTaken(dto.phoneNumber);
    await this.usersService.createUser(dto);

    const otp = await this.otpService.createOtp(dto.phoneNumber);
    await this.otpService.sendOtpToPhone(dto.phoneNumber, otp.code);
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ message: string }> {
    const { phoneNumber, otp } = dto;

    const otpStatus = await this.otpService.verifyOtpCode(phoneNumber, otp);

    if (otpStatus === OtpStatus.Blocked) {
      await this.usersService.blockUserByPhone(phoneNumber);
      throw new BadRequestException('Sai OTP quá số lần. Tài khoản bị khóa.');
    }

    if (otpStatus !== OtpStatus.Verified) {
      throw new BadRequestException('Mã OTP không chính xác.');
    }

    await this.usersService.verifyUserByPhone(phoneNumber);

    return { message: 'Xác minh OTP thành công.' };
  }

  async resendOtpToUser(dto: ResendOtpDto): Promise<{ message: string }> {
    const { phoneNumber } = dto;

    const user = await this.usersService.getUserForOtpResend(phoneNumber);

    const updatedOtp = await this.otpService.renewOrCreateOtp(phoneNumber);

    await this.otpService.sendOtpToPhone(phoneNumber, updatedOtp.code);

    return { message: 'Mã OTP mới đã được gửi.' };
  }

  async requestForgotPassword(dto: RequestForgotPasswordDto) {
    const user = await this.usersService.getUserForOtpResend(dto.phoneNumber);
    const otp = await this.otpService.createOtp(dto.phoneNumber);
    await this.otpService.sendOtpToPhone(dto.phoneNumber, otp.code);

    return { message: 'Mã OTP đã được gửi đến số điện thoại của bạn.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersService.getUserByPhone(dto.phoneNumber);

    if (!user || user.status !== UserStatus.Active) {
      throw new BadRequestException(
        'Người dùng không hợp lệ hoặc chưa xác minh.',
      );
    }

    await this.usersService.updatePassword(dto.phoneNumber, dto.newPassword);
    return { message: 'Mật khẩu đã được cập nhật.' };
  }

  async getAuthenticatedUser(phoneNumber, password) {
    try {
      const user = await this.usersService.getUserByPhone(phoneNumber);
      await this.verifyPassword(password, user?.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string | undefined,
  ) {
    if (!hashedPassword) {
      throw new BadRequestException('Wrong credentials provided');
    }

    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }

  getCookieWithJwtRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
    });
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
  }

  getCookieWithJwtAccessToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;
  }
}
