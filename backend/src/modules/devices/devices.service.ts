import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Device } from 'database/entities/device.entity';
import { CreateDeviceDto } from '@modules/devices/dtos/createDevice.dto';
import { UpdateDeviceDto } from '@modules/devices/dtos/updateDevice.dto';
import { ToggleDeviceDto } from '@modules/devices/dtos/toggleDevice.dto';
import { DeviceStatus, Severity } from '@common/enums';
import * as crypto from 'crypto';
import { AppError } from '@common/dtos/errorResponse.dto';
import { AdafruitService } from '@modules/adafruit/adafruit.service';
import { IDeviceRepository } from './repositories/device.repository.interface';
import { DEVICE_REPOSITORY } from '@common/constants';
import { Cron } from '@nestjs/schedule';
import { CreateNotificationDto } from '@modules/notification/dtos/createNotification.dto';
import { NotificationService } from '@modules/notification/notification.service';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
    private readonly adafruitService: AdafruitService,
    private readonly notiService: NotificationService
  ) { }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    await this.adafruitService.createFeed(
      createDeviceDto.name,
      createDeviceDto.key,
      createDeviceDto.description || '',
    );
    this.logger.log('Created feed on Adafruit');

    const newDevice = this.deviceRepository.create({
      ...createDeviceDto,
      status: DeviceStatus.OFFLINE,
    });

    return this.deviceRepository.save(newDevice);
  }

  async findAll(): Promise<Device[]> {
    const devices = await this.deviceRepository.find();

    for (const device of devices) {
      try {
        const feedData = await this.adafruitService.getFeed(device.key);
        device['last_value'] = feedData.last_value || null;
      } catch {
        device['last_value'] = null;
      }
    }

    return devices;
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOneById(id);
    if (!device)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        'Device not found',
        'DEVICE_NOT_FOUND',
      );

    try {
      const feedData = await this.adafruitService.getFeed(device.key);
      device['last_value'] = feedData.last_value || null;
    } catch {
      device['last_value'] = null;
    }

    return device;
  }

  async findOneByKey(key: string): Promise<Device> {
    const device = await this.deviceRepository.findOneByKey(key);
    if (!device)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        'Device not found',
        'DEVICE_NOT_FOUND',
      );

    return device;
  }

  async findUserIdByDeviceId(key: string): Promise<string | null> {
    const device = await this.deviceRepository.findOneByKey(key);
    return device?.ownerId || null;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);

    await this.adafruitService.updateFeed(
      device.key,
      updateDeviceDto.name || device.name,
      updateDeviceDto.description || device.description || '',
    );

    this.logger.log('Updated feed on Adafruit');
    Object.assign(device, updateDeviceDto);

    return this.deviceRepository.save(device);
  }

  async remove(id: string): Promise<void> {
    const device = await this.deviceRepository.findOneById(id);
    if (!device)
      throw new AppError(
        HttpStatus.NOT_FOUND,
        'Device not found',
        'DEVICE_NOT_FOUND',
      );

    await this.adafruitService.deleteFeed(device.key);
    this.logger.log('Deleted feed on Adafruit');

    await this.deviceRepository.remove(device);
  }

  async toggleStatus(
    id: string,
    toggleDeviceDto: ToggleDeviceDto,
  ): Promise<Device> {
    const device = await this.findOne(id);
    const newStatus = toggleDeviceDto.status;

    await this.adafruitService.toggleFeedStatus(
      device.key,
      newStatus === DeviceStatus.ONLINE ? '1' : '0',
    );
    this.logger.log('Updated device status on Adafruit:', newStatus);

    device.status = newStatus;
    return this.deviceRepository.save(device);
  }

  async findDevicesByUserId(userId: string) {
    const devices = await this.deviceRepository.findDevicesByUserId(userId);
    return devices;
  }


  @Cron('0 6 * * *') // Mỗi ngày lúc 6h sáng
  async runPump() {
    const devices = await this.deviceRepository.findPump();
    if (!devices) return;

    for (const device of devices) {
      await this.adafruitService.toggleFeedStatus(device.key, '1');

      const notification: CreateNotificationDto = {
        content: `Thiết bị bơm ${device.name} đã được kích hoạt tự động lúc 6h sáng.`,
        time: new Date(),
        severity: Severity.MEDIUM
      };

      await this.notiService.create(notification, device.ownerId);
    }
  }
}
