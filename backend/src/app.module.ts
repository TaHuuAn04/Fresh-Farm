import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'database/database.module';
import { DevicesModule } from '@modules/devices/devices.module';

@Module({
  imports: [
    DatabaseModule,
    DevicesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
