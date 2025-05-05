import { Notification } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NOTIFICATION_REPOSITORY } from '@common/constants';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationController } from './notification.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    providers: [
        NotificationService,
        {
            provide: NOTIFICATION_REPOSITORY,
            useClass: NotificationRepository,
        },
    ],
    controllers: [NotificationController],
    exports: [NotificationService],
})
export class NotificationModule { }
