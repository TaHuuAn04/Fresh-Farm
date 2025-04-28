import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from '@modules/otp/otp.service';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'database/entities/user.entity';
import { USERS_REPOSITORY } from '@common/constants';
import { UserRepository } from './repositories/users.repository';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
