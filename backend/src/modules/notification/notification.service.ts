import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { AppError } from '@common/dtos/errorResponse.dto';
import { NOTIFICATION_REPOSITORY } from '@common/constants';
import { INotificationRepository } from './repositories/notification.repository.interface';
import { CreateNotificationDto } from './dtos/createNotification.dto';
import { Notification } from '@entities';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notiRepository: INotificationRepository,
  ) {}

  async create(
    createNotiDto: CreateNotificationDto,
    userId: string,
  ): Promise<Notification> {
    const newNoti = this.notiRepository.create({
      ...createNotiDto,
      userId,
    });

    return this.notiRepository.save(newNoti);
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.notiRepository.find();
    return notifications;
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notiRepository.findOneById(id);
    if (!notification)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        'Notification not found',
        'NOTIFICATION_NOT_FOUND',
      );

    return notification;
  }

  async remove(id: string): Promise<void> {
    const notification = await this.notiRepository.findOneById(id);
    if (!notification)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        'Notification not found',
        'NOTIFICATION_NOT_FOUND',
      );

    await this.notiRepository.remove(notification);
  }
}
