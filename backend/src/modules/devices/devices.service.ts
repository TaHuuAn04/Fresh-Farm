import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from 'database/entities/device.entity';
import axios from 'axios';
import { CreateDeviceDto } from 'src/common/dtos/devices/createDevice.dto';
import { UpdateDeviceDto } from 'src/common/dtos/devices/updateDevice.dto';
import { ToggleDeviceDto } from 'src/common/dtos/devices/toggleDevice.dto';
import { DeviceStatus } from '@common/enums';
import * as crypto from 'crypto';

@Injectable()
export class DevicesService {
  private readonly adafruitUsername: string;
  private readonly adafruitKey: string;

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {
    this.adafruitUsername = process.env.ADAFRUIT_USERNAME || 'default_username';
    this.adafruitKey = process.env.ADAFRUIT_KEY || 'default_key';
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const key = crypto.randomBytes(16).toString('hex');

    try {
      const response = await axios.post(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds`,
        {
          name: createDeviceDto.name,
          key,
          description: createDeviceDto.description || '',
        },
        { headers: { 'X-AIO-Key': this.adafruitKey, 'Content-Type': 'application/json' } },
      );

      console.log('Created feed on Adafruit');

      const newDevice = this.deviceRepository.create({
        ...createDeviceDto,
        key,
        status: DeviceStatus.OFFLINE,
      });

      return this.deviceRepository.save(newDevice);
    } catch (error) {
      console.error('Failed to create feed on Adafruit:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create device on Adafruit IO');
    }
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) throw new NotFoundException('Device not found');
    return device;
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);

    try {
      await axios.patch(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds/${device.key}`,
        {
          name: updateDeviceDto.name || device.name,
          description: updateDeviceDto.description || device.description || '',
        },
        { headers: { 'X-AIO-Key': this.adafruitKey, 'Content-Type': 'application/json' } },
      );

      console.log('Updated feed on Adafruit');
    } catch (error) {
      console.error('Failed to update feed on Adafruit:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to update device on Adafruit IO');
    }

    Object.assign(device, updateDeviceDto);
    return this.deviceRepository.save(device);
  }

  async remove(id: string): Promise<void> {
    const device = await this.findOne(id);

    try {
      // Xóa feed trên Adafruit
      await axios.delete(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds/${device.key}`,
        { headers: { 'X-AIO-Key': this.adafruitKey } },
      );

      console.log('Deleted feed on Adafruit');
    } catch (error) {
      console.error('Failed to delete feed on Adafruit:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to delete device on Adafruit IO');
    }

    await this.deviceRepository.remove(device);
  }

  async toggleStatus(id: string, toggleDeviceDto: ToggleDeviceDto): Promise<Device> {
    const device = await this.findOne(id);
    const newStatus = toggleDeviceDto.status;

    try {
      // Gửi trạng thái lên Adafruit IO
      await axios.post(
        `https://io.adafruit.com/api/v2/${this.adafruitUsername}/feeds/${device.key}/data`,
        { value: newStatus === DeviceStatus.ONLINE ? '1' : '0' },
        { headers: { 'X-AIO-Key': this.adafruitKey, 'Content-Type': 'application/json' } },
      );

      console.log('Updated device status on Adafruit:', newStatus);
    } catch (error) {
      console.error('Failed to update device status on Adafruit:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to update device status on Adafruit IO');
    }
    device.status = newStatus;
    return this.deviceRepository.save(device);
  }
}
