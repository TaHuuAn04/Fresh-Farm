import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { OtpService } from '@modules/otp/otp.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@modules/users/users.module';
import { OtpModule } from '@modules/otp/otp.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
} from '@environments';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh.strategy';
import { MailModule } from '@modules/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    OtpModule,
    JwtModule.register({
      secret: JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: `${JWT_ACCESS_TOKEN_EXPIRATION_TIME}` },
    }),
    MailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
