import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { REPOSITORY_INJECTION_TOKEN } from '@common/enums/injection-token';
import { Inject } from '@nestjs/common';
import { IConversationRepository } from './repositories/conversation.interface';
import { IChatBotService } from './chat-bot.interface';
import { AxiosHeaders } from 'axios';
import { fetchDto, fetchStreamDto } from 'src/http';
import {
  GetPassportDifyAiDto,
  GetPassportDifyAiInputDto,
  GetPassportDifyAiResponseDto,
} from './dtos/passport.dto';
import { HttpService } from '@nestjs/axios';
import { IUsersRepository } from '@modules/users/repositories/users.repository.interface';
import { NIMSPACE_AI_ID, X_APP_CODE } from '@environments';
import {
  ChatAiResponseDto,
  ChatMessageDifyAiInputDataDto,
  ChatMessageDifyAiInputDto,
  PostChatMessageDifyAiDto,
} from './dtos/chat.dto';
import { IDeviceRepository } from '@modules/devices/repositories/device.repository.interface';
import { plainToInstance } from 'class-transformer';
import { ChatType } from '@common/enums';
import { Readable } from 'stream';

@Injectable()
export class ChatBotService implements IChatBotService {
  constructor(
    @Inject(REPOSITORY_INJECTION_TOKEN.CONVERSATION_REPOSITORY)
    private readonly conversationRepository: IConversationRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.USERS_REPOSITORY)
    private readonly userRepository: IUsersRepository,

    @Inject(REPOSITORY_INJECTION_TOKEN.DEVICE_REPOSITORY)
    private readonly deviceRepository: IDeviceRepository,

    private readonly httpService: HttpService,
  ) {}

  async getPassport(
    input: GetPassportDifyAiInputDto,
  ): Promise<GetPassportDifyAiResponseDto> {
    const dto = new GetPassportDifyAiDto(input.body, input.headers);
    const response = await fetchDto<GetPassportDifyAiResponseDto>({
      httpService: this.httpService,
      headers: new AxiosHeaders({
        ...input.headers,
      }),
      dto,
    });
    return response.data;
  }

  async chatAIBlocking(
    input: ChatMessageDifyAiInputDataDto,
  ): Promise<ChatAiResponseDto> {
    try {
      const token = await this.getPassport({
        body: {
          email: input.user.email,
          name: input.user.fullName,
          nimspace_ai_id: NIMSPACE_AI_ID,
        },
        headers: {
          'x-app-code': X_APP_CODE,
        },
      });

      const chatInput = new ChatMessageDifyAiInputDto();
      chatInput.body = {
        query: input.query,
        conversation_id: input.conversationId,
        response_mode: input.type,
        parent_message_id: input.messageId ?? undefined,
        inputs: {
          user_name: input.user.fullName,
          list_devices: input.listDevices,
        },
      };
      chatInput.token = token.access_token;

      const dto = new PostChatMessageDifyAiDto(chatInput.body);
      const response = await fetchDto<string>({
        dto,
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token.access_token}`,
        }),
      });

      if (!response.status) {
        throw new InternalServerErrorException(
          'Failed to get conversation',
          response.data,
        );
      }

      return plainToInstance(ChatAiResponseDto, response.data);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to get conversation',
        error instanceof Error ? error.message : 'Unknown error occurred',
      );
    }
  }

  async chatMessageBlocking(
    query: string,
    userId: string,
  ): Promise<ChatAiResponseDto> {
    try {
      const user = await this.userRepository.findOneById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const Devices = await this.deviceRepository.findDevicesByUserId(userId);

      let listDevices = '';
      if (Devices) {
        listDevices = Devices.map((device) => device.key).join(',');
      }

      const conversation =
        await this.conversationRepository.getConversationByUserId(userId);

      const respondMessage = await this.chatAIBlocking({
        user: user,
        query: query,
        conversationId: conversation?.conversationId ?? '',
        messageId: conversation?.messageId ?? undefined,
        listDevices: listDevices,
        xAppCode: X_APP_CODE,
        type: ChatType.BLOCKING,
      });

      await this.conversationRepository.upsertConversation({
        conversationId: respondMessage.conversation_id ?? '',
        messageId: respondMessage.message_id,
        userId: userId,
      });

      return respondMessage;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('Failed to get conversation');
    }
  }

  async chatAIStreaming(
    input: ChatMessageDifyAiInputDataDto,
  ): Promise<Readable> {
    try {
      const token = await this.getPassport({
        body: {
          email: input.user.email,
          name: input.user.fullName,
          nimspace_ai_id: NIMSPACE_AI_ID,
        },
        headers: {
          'x-app-code': X_APP_CODE,
        },
      });

      const chatInput = new ChatMessageDifyAiInputDto();
      chatInput.body = {
        query: input.query,
        conversation_id: input.conversationId,
        response_mode: input.type,
        parent_message_id: input.messageId ?? undefined,
        inputs: {
          user_name: input.user.fullName,
          list_devices: input.listDevices,
        },
      };
      chatInput.token = token.access_token;

      const dto = new PostChatMessageDifyAiDto(chatInput.body);
      const response = await fetchStreamDto({
        dto,
        httpService: this.httpService,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${token.access_token}`,
        }),
      });

      if (!response.status) {
        throw new InternalServerErrorException('Failed to get conversation');
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('Failed to get conversation ' + error);
    }
  }

  async chatMessageStreaming(query: string, userId: string): Promise<Readable> {
    try {
      const user = await this.userRepository.findOneById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const Devices = await this.deviceRepository.findDevicesByUserId(userId);

      let listDevices = '';
      if (Devices) {
        listDevices = Devices.map((device) => device.key).join(',');
      }

      const conversation =
        await this.conversationRepository.getConversationByUserId(userId);

      const respondMessage = await this.chatAIStreaming({
        user: user,
        query: query,
        conversationId: conversation?.conversationId ?? '',
        messageId: conversation?.messageId ?? undefined,
        listDevices: listDevices,
        xAppCode: X_APP_CODE,
        type: ChatType.STREAMING,
      });

      return respondMessage;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new Error('Failed to get conversation');
    }
  }

  async storeConversation(
    conversationId: string,
    messageId: string,
    userId: string,
  ): Promise<void> {
    await this.conversationRepository.upsertConversation({
      conversationId: conversationId,
      messageId: messageId,
      userId: userId,
    });
  }
}
