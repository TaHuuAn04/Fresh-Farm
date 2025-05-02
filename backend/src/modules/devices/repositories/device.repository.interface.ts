import { Device } from '@entities';

export interface IDeviceRepository {
  create(data: Partial<Device>): Device;
  save(device: Device): Promise<Device>;
  find(): Promise<Device[]>;
  findOneById(id: string): Promise<Device | null>;
  remove(device: Device): Promise<void>;
  findOneByKey(key: string): Promise<Device | null>;
  findDevicesByUserId(userId: string): Promise<Device[] | null>;
}
