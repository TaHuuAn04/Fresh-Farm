import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Device } from 'database/entities/device.entity';
import { CreateDeviceDto } from '@modules/devices/dtos/createDevice.dto';
import { UpdateDeviceDto } from '@modules/devices/dtos/updateDevice.dto';
import { ToggleDeviceDto } from '@modules/devices/dtos/toggleDevice.dto';
import { DeviceStatus, Severity } from '@common/enums';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '@common/dtos/errorResponse.dto';
import { AdafruitService } from '@modules/adafruit/adafruit.service';
import { IDeviceRepository } from './repositories/device.repository.interface';
import { DEVICE_REPOSITORY } from '@common/constants';
import { Cron } from '@nestjs/schedule';
import { CreateNotificationDto } from '@modules/notification/dtos/createNotification.dto';
import { NotificationService } from '@modules/notification/notification.service';
import { fetchDto } from 'src/http';
import { DetectionResponseDto, PostDetectionDto } from './dtos/detection.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosHeaders } from 'axios';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    @Inject(DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,
    private readonly adafruitService: AdafruitService,
    private readonly notiService: NotificationService,
    private readonly httpService: HttpService,
  ) {}

  async create(
    createDeviceDto: CreateDeviceDto,
    userId: string,
  ): Promise<Device> {
    const deviceKey = uuidv4();

    await this.adafruitService.createFeed(
      createDeviceDto.name,
      deviceKey,
      createDeviceDto.description || '',
    );
    this.logger.log('Created feed on Adafruit');

    const newDevice = this.deviceRepository.create({
      ...createDeviceDto,
      status: DeviceStatus.OFFLINE,
      key: deviceKey,
      ownerId: userId,
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

    const devicesWithFeed = await Promise.all(
      devices?.map(async (device) => {
        const feedOfDevice = await this.adafruitService.getFeed(device.key);

        return {
          ...device,
          value: feedOfDevice?.last_value || 0,
        };
      }) || [],
    ); // Ensure it's never undefined

    return devicesWithFeed;
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
        severity: Severity.MEDIUM,
      };

      await this.notiService.create(notification, device.ownerId);
    }
  }

  @Cron('15 6 * * *')
  async turnOffPump() {
    const devices = await this.deviceRepository.findPump();
    if (!devices) return;

    for (const device of devices) {
      await this.adafruitService.toggleFeedStatus(device.key, '0');

      const notification: CreateNotificationDto = {
        content: `Thiết bị bơm ${device.name} đã được tắt vào lúc 6:15 sáng.`,
        time: new Date(),
        severity: Severity.MEDIUM,
      };

      await this.notiService.create(notification, device.ownerId);
    }
  }

  async updateStatusFarm(
    userId: string,
    duration: number,
  ): Promise<DetectionResponseDto> {
    const dto = new PostDetectionDto({ duration });

    try {
      const response = await fetchDto<DetectionResponseDto>({
        dto,
        httpService: this.httpService,
        headers: new AxiosHeaders({
          'Content-Type': 'application/json',
        }),
      });

      if (!response.data.status) {
        throw new AppError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Failed to update farm status',
          'FAILED_TO_UPDATE_FARM_STATUS',
        );
      }
      const notification: CreateNotificationDto = {
        content: `Trạng thái trang trại đã được cập nhật là: Loại lá phát hiện là ${response.data.detection_results.classes.join(', ')}`,
        time: new Date(),
        severity: Severity.MEDIUM,
      };

      await this.notiService.create(notification, userId);

      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update farm status',
        'FAILED_TO_UPDATE_FARM_STATUS',
      );
    }
  }
}
