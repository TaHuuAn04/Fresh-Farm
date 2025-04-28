import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'database/entities/user.entity';
import { IUsersRepository } from './users.repository.interface';
import { AppError } from '@common/dtos/errorResponse.dto';

@Injectable()
export class UserRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  create(data: Partial<User>): User {
    return this.repo.create(data);
  }

  save(User: User): Promise<User> {
    return this.repo.save(User);
  }

  find(): Promise<User[]> {
    return this.repo.find();
  }

  async findOneById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOneByField(field: string, value: string): Promise<User | null> {
    const fields = ['email', 'phoneNumber'];
    if (!fields.includes(field)) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Field cần query không hợp lệ',
        'QUERY_ERROR',
      );
    }
    return this.repo.findOne({ where: { [field]: value } });
  }

  async remove(User: User): Promise<void> {
    await this.repo.remove(User);
  }
}
