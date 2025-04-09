import { Device } from 'database/entities/device.entity';
import { CreateDeviceDto } from '../dtos/createDevice.dto';
import { UpdateDeviceDto } from '../dtos/updateDevice.dto';

export interface IDeviceRepository {
  create(data: Partial<Device>): Device;
  save(device: Device): Promise<Device>;
  find(): Promise<Device[]>;
  findOneById(id: string): Promise<Device | null>;
  remove(device: Device): Promise<void>;
}
