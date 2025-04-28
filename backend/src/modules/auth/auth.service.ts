import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  HttpStatus,
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
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from '@environments';
import { MailService } from '@modules/mail/mail.service';
import { SendOtpDto } from '@modules/mail/dto/sendOtp.dto';
import { AppError } from '@common/dtos/errorResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async registerUser(dto: RegisterDto) {
    try {
      await this.usersService.ensurePhoneNumberNotTaken(dto.phoneNumber);
      await this.usersService.createUser(dto);

      const otp = await this.otpService.createOtp(dto.phoneNumber);
      //await this.otpService.sendOtpToPhone(dto.phoneNumber, otp.code);
      const sendOtpDto: SendOtpDto = {
        email: dto.email,
        code: otp,
        name: dto.fullName,
      };
      await this.mailService.sendOtp(sendOtpDto);

      return { message: 'Mã OTP đã được gửi.' };
    } catch (error) {
      console.log(error);
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    try {
      const { phoneNumber, otp } = dto;

      const otpStatus = await this.otpService.verifyOtpCode(phoneNumber, otp);

      if (otpStatus === OtpStatus.Blocked) {
        await this.usersService.blockUserByPhone(phoneNumber);
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          'Sai OTP quá số lần. Tài khoản bị khóa.',
          'OTP_REACH_LIMIT',
        );
      }

      if (otpStatus !== OtpStatus.Verified) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          'Mã OTP không chính xác.',
          'OTP_REACH_LIMIT',
        );
      }

      await this.usersService.verifyUserByPhone(phoneNumber);

      return { message: 'Xác minh OTP thành công.' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Xảy ra lỗi khi xác thực người dùng',
        'VERIFY_USER_ERROR',
      );
    }
  }

  async resendOtpToUser(dto: ResendOtpDto): Promise<{ message: string }> {
    const { phoneNumber } = dto;

    const user = await this.usersService.getUserForOtpResend(phoneNumber);

    const updatedOtp = await this.otpService.renewOrCreateOtp(phoneNumber);

    const sendOtpDto: SendOtpDto = {
      email: user.email,
      code: updatedOtp,
      name: user.fullName,
    };
    await this.mailService.sendOtp(sendOtpDto);

    return { message: 'Mã OTP mới đã được gửi.' };
  }

  async requestForgotPassword(dto: RequestForgotPasswordDto) {
    const user = await this.usersService.getUserForOtpResend(dto.phoneNumber);
    const otp = await this.otpService.createOtp(dto.phoneNumber);

    const sendOtpDto: SendOtpDto = {
      email: user.email,
      code: otp,
      name: user.fullName,
    };
    await this.mailService.sendOtp(sendOtpDto);

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
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
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
