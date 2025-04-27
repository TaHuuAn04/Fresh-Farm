import { ApiProperty } from '@nestjs/swagger';
import { DeviceStatus } from '@common/enums';
import { IsEnum } from 'class-validator';

export class ToggleDeviceDto {
  @ApiProperty({ description: 'Trạng thái thiết bị', enum: DeviceStatus })
  @IsEnum(DeviceStatus)
  status: DeviceStatus;
}
