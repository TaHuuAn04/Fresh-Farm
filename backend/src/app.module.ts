import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'database/database.module';
import { DevicesModule } from '@modules/devices/devices.module';
import { AdafruitModule } from './modules/adafruit/adafruit.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { CONFIG_KEY } from './config/config-key';
import loggerConfig from './config/logger/log.config';
import { AuthModule } from '@modules/auth/auth.module';
import { MailModule } from '@modules/mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loggerConfig], // Load logger
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transports: configService.get(CONFIG_KEY.LOGGER).transports,
      }),
    }),
    CacheModule.register({
      //store: redisStore,
      // host: 'localhost',
      // port: 6379,
      isGlobal: true,
      ttl: 600 * 1000,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
    DatabaseModule,
    DevicesModule,
    AdafruitModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
