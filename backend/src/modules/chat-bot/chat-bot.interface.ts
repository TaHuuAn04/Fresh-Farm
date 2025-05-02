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
  chatAI(input: ChatMessageDifyAiInputDataDto): Promise<ChatAiResponseDto>;

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
}
