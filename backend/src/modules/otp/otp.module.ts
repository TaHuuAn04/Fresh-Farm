import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from '@modules/otp/otp.service';
import { Otp } from 'database/entities/otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP_REPOSITORY } from '@common/constants';
import { OtpRepository } from './repositories/otp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [
    OtpService,
    {
      provide: OTP_REPOSITORY,
      useClass: OtpRepository,
    },
  ],
  controllers: [],
  exports: [OtpService],
})
export class OtpModule {}
