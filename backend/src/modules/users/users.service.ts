import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { AppError } from '@common/dtos/errorResponse.dto';
import { USERS_REPOSITORY } from '@common/constants';
import { IUsersRepository } from './repositories/users.repository.interface';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from 'database/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { UserStatus } from '@common/enums';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}

  async ensurePhoneNumberNotTaken(phoneNumber: string): Promise<void> {
    const existingUser =
      await this.usersRepository.findOneByPhoneNumber(phoneNumber);
    if (existingUser) {
      throw new BadRequestException('Số điện thoại đã được sử dụng.');
    }
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async verifyUserByPhone(phoneNumber: string): Promise<void> {
    const user = await this.getUserByPhone(phoneNumber);
    user.status = UserStatus.Active;
    await this.usersRepository.save(user);
  }

  async blockUserByPhone(phoneNumber: string): Promise<void> {
    const user = await this.getUserByPhone(phoneNumber);
    user.status = UserStatus.Banned;
    user.lastTimeBlocked = new Date();
    await this.usersRepository.save(user);
  }

  async getUserForOtpResend(phoneNumber: string): Promise<User> {
    const user = await this.getUserByPhone(phoneNumber);

    if (user.status === UserStatus.Banned) {
      const blockTime = user.lastTimeBlocked;

      if (!blockTime) {
        throw new BadRequestException('Không có thông tin thời gian bị khóa.');
      }

      const unlockTime = new Date(blockTime.getTime() + 15 * 60 * 1000); // 15 phút

      if (Date.now() < unlockTime.getTime()) {
        throw new BadRequestException(
          `Tài khoản bị khóa. Vui lòng thử lại sau lúc ${unlockTime.toLocaleTimeString()}`,
        );
      }

      // Nếu đã hết thời gian khóa, mở khóa tự động
      user.status = UserStatus.Pending;
      user.lastTimeBlocked = null;

      await this.usersRepository.save(user);
    }

    return user;
  }

  async getUserByPhone(phoneNumber: string): Promise<User> {
    const user = await this.usersRepository.findOneByPhoneNumber(phoneNumber);
    if (!user) {
      throw new BadRequestException('Không tìm thấy người dùng.');
    }
    return user;
  }

  async updatePassword(
    phoneNumber: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.getUserByPhone(phoneNumber);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.usersRepository.save(user);
  }

  async unlockUser(user: User): Promise<void> {
    user.status = UserStatus.Pending;
    user.lastTimeBlocked = null;
    await this.usersRepository.save(user);
  }

  async getUnlockTime(user: User): Promise<Date> {
    if (!user.lastTimeBlocked) {
      throw new BadRequestException('Tài khoản chưa từng bị khóa');
    }
    return new Date(user.lastTimeBlocked.getTime() + 15 * 60 * 1000);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOneById(id);

    return user;
  }

  private getRefreshTokenFromCookie(cookieStr) {
    const match = cookieStr.match(/Refresh=([^;]+)/);
    return match ? match[1] : null;
  }

  async setCurrentRefreshToken(cookie: string, userId: string) {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    user.refreshToken = this.getRefreshTokenFromCookie(cookie);
    await this.usersRepository.save(user);
  }

  async removeRefreshToken(userId: string) {
    const user = await this.usersRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    user.refreshToken = null;
    await this.usersRepository.save(user);
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findById(userId);
    console.log('user', user);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (!user.refreshToken) {
      throw new BadRequestException('Người dùng không có refresh token');
    }

    if (user.refreshToken == refreshToken) {
      return user;
    }

    return null;
  }
}
