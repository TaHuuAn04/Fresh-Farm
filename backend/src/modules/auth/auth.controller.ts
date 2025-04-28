import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { LoginDto } from './dtos/login.dto';
import { ResendOtpDto } from './dtos/resend-otp.dto';
import { RequestForgotPasswordDto } from './dtos/request-forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { LocalAuthGuard } from './guard/localAuth.guard';
import RequestWithUser from './interface/requestWithUser.interface';
import { Response } from 'express';
import JwtAuth from './guard/jwtAuth.guard';
import { UsersService } from '@modules/users/users.service';
import JwtRefreshGuard from './guard/jwtAuthRefresh.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.registerUser(dto);
  }

  @Post('otp/verify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('otp/resend')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendOtpToUser(dto);
  }

  @Post('forgot-password/request')
  requestForgotPassword(@Body() dto: RequestForgotPasswordDto) {
    return this.authService.requestForgotPassword(dto);
  }

  @Post('forgot-password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
    );
    const refreshTokenCookie =
      await this.authService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshTokenCookie, user.id);

    response.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    user.password = undefined;
    return response.send(user);
  }

  @UseGuards(JwtAuth)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.usersService.removeRefreshToken(request.user.id);
    response.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser, @Res() response: Response) {
    console.log('refreshing token...');
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    response.setHeader('Set-Cookie', accessTokenCookie);
    return response.send(request.user);
  }
}
