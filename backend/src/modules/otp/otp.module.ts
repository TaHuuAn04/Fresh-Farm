import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from '@modules/otp/otp.service';
import { Otp } from 'database/entities/otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP_REPOSITORY } from '@common/constants';
import { OtpRepository } from './repositories/otp.repository';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost', // Địa chỉ Redis server
      port: 6379, // Cổng Redis
      ttl: 600, // Thời gian sống mặc định của key (giây)
    }),
  ],
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
