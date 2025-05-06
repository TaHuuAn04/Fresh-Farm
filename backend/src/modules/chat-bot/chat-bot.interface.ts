import { Readable } from 'stream';
import {
  ChatAiResponseDto,
  ChatMessageDifyAiInputDataDto,
} from './dtos/chat.dto';
import {
  GetPassportDifyAiInputDto,
  GetPassportDifyAiResponseDto,
} from './dtos/passport.dto';

export interface IChatBotService {
  /**
   * Get passport means get access token from dify ai
   * @param input
   * @returns
   */
  getPassport(
    input: GetPassportDifyAiInputDto,
  ): Promise<GetPassportDifyAiResponseDto>;

  /**
   * Chat ai by calling API dify ai
   * @param input
   * @returns
   */
  chatAIBlocking(
    input: ChatMessageDifyAiInputDataDto,
  ): Promise<ChatAiResponseDto>;

  /**
   * Chat ai by calling API dify ai
   * @param input
   * @returns
  /**
   * Chat message blocking, chat message with blocking mode
   * @param userId
   * @param query
   * @returns
   */
  chatMessageBlocking(
    query: string,
    userId: string,
  ): Promise<ChatAiResponseDto>;

  /**
   * Chat message streaming, chat message with streaming mode
   * @param userId
   * @param query
   * @returns
   */
  chatMessageStreaming(query: string, userId: string): Promise<Readable>;

  /**
   * Store conversation
   * @param conversationId
   * @param messageId
   * @param userId
   * @returns
   */
  storeConversation(
    conversationId: string,
    messageId: string,
    userId: string,
  ): Promise<void>;
}
