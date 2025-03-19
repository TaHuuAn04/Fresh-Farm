import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { DatabaseModule } from 'database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'database/entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device])],
  providers: [DevicesService],
  controllers: [DevicesController],
})
export class DevicesModule {}
