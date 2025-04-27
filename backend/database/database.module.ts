import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DB_NAME_DEVELOPMENT, DB_PASS, DB_USER } from '@environments';
import { User } from './entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost',
      port: 5432,
      username: DB_USER,
      password: DB_PASS,
      database: DB_NAME_DEVELOPMENT,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'], 
      synchronize: true, 
      autoLoadEntities: true, 
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
