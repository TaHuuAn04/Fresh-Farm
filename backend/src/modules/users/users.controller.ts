import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  BadRequestException,
  NotFoundException,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { User } from 'database/entities/user.entity';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AppError } from '@common/dtos/errorResponse.dto';
import { UserStatus } from '@common/enums';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by phone number' })
  @ApiResponse({ status: 200, description: 'User found.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      console.log(error);
    }
    
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users retrieved.' })
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }
}
