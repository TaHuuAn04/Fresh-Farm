import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { IConversationRepository } from './conversation.interface';
import { Conversation } from '@entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConversationRespondDto,
  InputDeleteConversationDto,
  InputUpsertConversationDto,
} from '../dtos/conversation.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  private readonly logger = new Logger(ConversationRepository.name);

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async upsertConversation(
    input: InputUpsertConversationDto,
  ): Promise<ConversationRespondDto> {
    try {
      const conversationExisted = await this.conversationRepository.findOne({
        where: {
          userId: input.userId,
          conversationId: input.conversationId,
        },
      });
      if (conversationExisted) {
        // update conversation
        conversationExisted.messageId = input.messageId;
        await this.conversationRepository.save(conversationExisted);
        return conversationExisted;
      }
      const conversation = this.conversationRepository.create(input);
      await this.conversationRepository.save(conversation);
      return plainToInstance(ConversationRespondDto, conversation);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create conversation');
    }
  }

  async deleteConversation(input: InputDeleteConversationDto): Promise<void> {
    try {
      const conversation = await this.conversationRepository.findOne({
        where: {
          id: input.id,
        },
      });
      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }
      await this.conversationRepository.delete(input.id);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to delete conversation');
    }
  }

  async getConversationByUserId(
    userId: string,
  ): Promise<ConversationRespondDto> {
    try {
      const conversation = await this.conversationRepository.findOne({
        where: {
          userId,
        },
      });
      return plainToInstance(ConversationRespondDto, conversation);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to get conversation');
    }
  }
}
