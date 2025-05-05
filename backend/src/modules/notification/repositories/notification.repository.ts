import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { INotificationRepository } from './notification.repository.interface';
import { Notification } from '@entities';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repo: Repository<Notification>,
  ) { }

  create(data: Partial<Notification>): Notification {
    return this.repo.create(data);
  }

  save(noti: Notification): Promise<Notification> {
    return this.repo.save(noti);
  }

  find(): Promise<Notification[]> {
    return this.repo.find();
  }

  async findOneById(id: string): Promise<Notification | null> {
    return this.repo.findOne({ where: { id } });
  }

  async remove(noti: Notification): Promise<void> {
    await this.repo.remove(noti);
  }
}
