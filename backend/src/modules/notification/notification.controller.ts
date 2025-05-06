import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dtos/createNotification.dto';
import JwtAuthGuard from '@modules/auth/guard/jwtAuth.guard';
import RequestWithUser from '@modules/auth/interface/requestWithUser.interface';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Tạo thông báo mới cho người dùng' })
    @ApiResponse({ status: 201, description: 'Thông báo được tạo thành công' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
    async create(@Req() request: RequestWithUser, @Body() createNotiDto: CreateNotificationDto) {
        return this.notificationService.create(createNotiDto, request.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Lấy danh sách tất cả thông báo' })
    @ApiResponse({ status: 200, description: 'Danh sách thông báo' })
    async findAll() {
        return this.notificationService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Lấy thông tin chi tiết của một thông báo' })
    @ApiParam({ name: 'id', required: true, description: 'ID của thông báo' })
    @ApiResponse({ status: 200, description: 'Thông tin thông báo' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy thông báo' })
    async findOne(@Param('id') id: string) {
        return this.notificationService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Xóa một thông báo theo ID' })
    @ApiParam({ name: 'id', required: true, description: 'ID của thông báo' })
    @ApiResponse({ status: 200, description: 'Thông báo đã được xóa' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy thông báo' })
    async remove(@Param('id') id: string) {
        return this.notificationService.remove(id);
    }
}
