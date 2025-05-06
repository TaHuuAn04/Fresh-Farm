import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from '@modules/otp/otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP_REPOSITORY } from '@common/constants';

@Module({
  imports: [],
  providers: [OtpService],
  controllers: [],
  exports: [OtpService],
})
export class OtpModule {}
