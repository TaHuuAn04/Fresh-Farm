import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DeviceStatus } from '@common/enums';

export class UpdateDeviceDto {
  @ApiPropertyOptional({ description: 'Tên của thiết bị', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ description: 'Trạng thái của thiết bị', enum: DeviceStatus })
  @IsOptional()
  @IsEnum(DeviceStatus)
  status?: DeviceStatus;

  @ApiPropertyOptional({ description: 'Mô tả thiết bị' })
  @IsOptional()
  @IsString()
  description?: string;
}
