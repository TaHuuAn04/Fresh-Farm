import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'database/entities/device.entity';
import { DevicesService } from './devices.service';
import { AdafruitService } from '../adafruit/adafruit.service';
import { DeviceRepository } from './repositories/device.repository';
import { DEVICE_REPOSITORY } from '@common/constants';
import { DevicesController } from './devices.controller';
import { DeviceGateway } from './device.gateway';
import { UsersModule } from '@modules/users/users.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    UsersModule,
    NotificationModule,
    HttpModule,
  ],
  providers: [
    DeviceGateway,
    DevicesService,
    AdafruitService,
    {
      provide: DEVICE_REPOSITORY,
      useClass: DeviceRepository,
    },
  ],
  controllers: [DevicesController],
  exports: [DevicesService],
})
export class DevicesModule {}
