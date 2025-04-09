import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Thay đổi tùy DB bạn sử dụng
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_DEVELOPMENT,
      entities: [Device], // Thêm các entity vào đây
      synchronize: true, // Chỉ dùng khi phát triển, không nên dùng ở production
      autoLoadEntities: true, // Tự động load các entity nếu không muốn liệt kê thủ công
    }),
    TypeOrmModule.forFeature([Device]), // Để sử dụng repository trong module con
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
