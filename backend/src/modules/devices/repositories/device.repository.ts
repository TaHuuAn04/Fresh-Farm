import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from 'database/entities/device.entity';
import { IDeviceRepository } from './device.repository.interface';
import { DeviceType } from '@common/enums';

@Injectable()
export class DeviceRepository implements IDeviceRepository {
  constructor(
    @InjectRepository(Device)
    private readonly repo: Repository<Device>,
  ) { }

  create(data: Partial<Device>): Device {
    return this.repo.create(data);
  }

  save(device: Device): Promise<Device> {
    return this.repo.save(device);
  }

  find(): Promise<Device[]> {
    return this.repo.find();
  }

  async findOneById(id: string): Promise<Device | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findOneByKey(key: string): Promise<Device | null> {
    return this.repo.findOne({ where: { key } });
  }

  async remove(device: Device): Promise<void> {
    await this.repo.remove(device);
  }

  async findDevicesByUserId(userId: string): Promise<Device[] | null> {
    return this.repo.find({
      where: {
        ownerId: userId,
      },
    });
  }

  async findPump(): Promise<Device[] | null> {
    return this.repo.findBy({ type: DeviceType.ACTUATOR_PUMP });
  }
}
