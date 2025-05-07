import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from '@modules/devices/dtos/createDevice.dto';
import { UpdateDeviceDto } from '@modules/devices/dtos/updateDevice.dto';
import { ToggleDeviceDto } from '@modules/devices/dtos/toggleDevice.dto';
import JwtAuthGuard from '@modules/auth/guard/jwtAuth.guard';
import RequestWithUser from '@modules/auth/interface/requestWithUser.interface';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@entities';
import { DetectionResponseDto } from './dtos/detection.dto';

@ApiTags('Devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Tạo một thiết bị mới' })
  @ApiResponse({ status: 201, description: 'Thiết bị được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  async create(
    @Req() request: RequestWithUser,
    @Body() createDeviceDto: CreateDeviceDto,
  ) {
    return this.devicesService.create(createDeviceDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả thiết bị' })
  async findAll(@Req() request: RequestWithUser) {
    return this.devicesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Lấy danh sách tất cả thiết bị của người dùng' })
  async findALlByUserId(@Req() request: RequestWithUser) {
    return this.devicesService.findDevicesByUserId(request.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một thiết bị theo ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID của thiết bị' })
  async findOne(@Param('id') id: string) {
    return this.devicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin thiết bị' })
  @ApiParam({ name: 'id', required: true, description: 'ID của thiết bị' })
  async update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa một thiết bị' })
  @ApiParam({ name: 'id', required: true, description: 'ID của thiết bị' })
  async remove(@Param('id') id: string) {
    return this.devicesService.remove(id);
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Bật / tắt thiết bị' })
  @ApiParam({ name: 'id', required: true, description: 'ID của thiết bị' })
  async toggleStatus(
    @Param('id') id: string,
    @Body() toggleDeviceDto: ToggleDeviceDto,
  ) {
    return this.devicesService.toggleStatus(id, toggleDeviceDto);
  }

  @Post('status-farm')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'update status farm' })
  @ApiParam({
    name: 'duration',
  })
  async updateStatusFarm(
    @CurrentUser() user: User,
    @Query('duration') duration: number,
  ): Promise<DetectionResponseDto> {
    console.log('duration', duration);
    return this.devicesService.updateStatusFarm(user.id, duration);
  }
}
