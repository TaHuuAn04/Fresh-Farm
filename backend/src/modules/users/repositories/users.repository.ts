import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'database/entities/user.entity';
import { IUsersRepository } from './users.repository.interface';

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

  async findOneByPhoneNumber(phone: string): Promise<User | null> {
    return this.repo.findOne({ where: { phoneNumber: phone } });
  }

  async remove(User: User): Promise<void> {
    await this.repo.remove(User);
  }
}
