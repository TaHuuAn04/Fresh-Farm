import { User } from 'database/entities/user.entity';

export interface IUsersRepository {
  create(data: Partial<User>): User;
  save(User: User): Promise<User>;
  find(): Promise<User[]>;
  findOneById(id: string): Promise<User | null>;
  findOneByPhoneNumber(phoneNumber: string): Promise<User | null>;
  remove(User: User | null): Promise<void>;
}
