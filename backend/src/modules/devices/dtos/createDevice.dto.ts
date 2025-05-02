import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { DeviceStatus } from '@common/enums';

export class CreateDeviceDto {
  @ApiProperty({ description: 'Tên thiết bị', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    description: 'Trạng thái thiết bị',
    enum: DeviceStatus,
  })
  @IsEnum(DeviceStatus)
  @IsOptional()
  status?: DeviceStatus;

  @ApiPropertyOptional({ description: 'Mô tả thiết bị' })
  @IsString()
  @IsOptional()
  description?: string;
}
