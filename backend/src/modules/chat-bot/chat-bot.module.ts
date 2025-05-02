import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Device, User } from '@entities';
import { ConversationRepository } from './repositories/conversation.repository';
import {
  INJECTION_TOKEN,
  REPOSITORY_INJECTION_TOKEN,
} from '@common/enums/injection-token';
import { ChatBotService } from './chat-bot.service';
import { UserRepository } from '@modules/users/repositories/users.repository';
import { DeviceRepository } from '@modules/devices/repositories/device.repository';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '@modules/users/users.module';
import { DevicesModule } from '@modules/devices/devices.module';
import { ChatBotController } from './chat-bot.controller';

const adapters = [
  {
    provide: REPOSITORY_INJECTION_TOKEN.CONVERSATION_REPOSITORY,
    useClass: ConversationRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.USERS_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: REPOSITORY_INJECTION_TOKEN.DEVICE_REPOSITORY,
    useClass: DeviceRepository,
  },
  {
    provide: INJECTION_TOKEN.CHAT_BOT_SERVICE,
    useClass: ChatBotService,
  },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, User, Device]),
    HttpModule,
    UsersModule,
    DevicesModule,
  ],
  controllers: [ChatBotController],
  providers: [...adapters],
  exports: [...adapters],
})
export class ChatBotModule {}
