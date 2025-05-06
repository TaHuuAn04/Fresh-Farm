import {
  ConversationRespondDto,
  InputDeleteConversationDto,
  InputUpsertConversationDto,
} from '../dtos/conversation.dto';

export interface IConversationRepository {
  upsertConversation(
    input: InputUpsertConversationDto,
  ): Promise<ConversationRespondDto>;

  deleteConversation(input: InputDeleteConversationDto): Promise<void>;

  getConversationByUserId(userId: string): Promise<ConversationRespondDto>;
}
