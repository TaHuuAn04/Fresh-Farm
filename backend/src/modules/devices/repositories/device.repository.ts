import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from 'database/entities/device.entity';
import { IDeviceRepository } from './device.repository.interface';

@Injectable()
export class DeviceRepository implements IDeviceRepository {
  constructor(
    @InjectRepository(Device)
    private readonly repo: Repository<Device>,
  ) {}

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

  async remove(device: Device): Promise<void> {
    await this.repo.remove(device);
  }
}
