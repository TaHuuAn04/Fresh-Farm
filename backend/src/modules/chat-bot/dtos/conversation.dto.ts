import { HttpMethod } from '@common/enums';
import { BASE_URL_AI } from '@environments';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { HttpFetchDto } from 'src/http';

export class InputUpsertConversationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;
}

export class InputDeleteConversationDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class InputGetConversationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}

export class ConversationRespondDto {
  @Expose()
  id: string;

  @Expose()
  conversationId: string;

  @Expose()
  messageId: string;

  @Expose()
  userId: string;
}

export class ChatMessageItemDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The id of the message',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The message',
    example: 'Hello, how are you?',
  })
  @Expose()
  message: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The type of the message',
    example: 'received',
  })
  @Expose()
  type: 'received' | 'sent';
}

export class MessageItemPaginationDifyAiDto {
  id: string;
  conversation_id: string;
  inputs: Record<string, unknown>;
  query: string;
  answer: string;
  created_at: number;
}

export class GetMessagesByConversationIdPaginationDifyAiResponseDto {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
  data: MessageItemPaginationDifyAiDto[];
}

export class GetMessagesByConversationIdPaginationDifyAiQueryDto {
  conversation_id: string;
  limit: number;
  page: number;
}

export class GetMessagesByConversationIdPaginationDifyAiInputDto {
  query: GetMessagesByConversationIdPaginationDifyAiQueryDto;
  token: string;
}

export class GetMessagesByConversationIdPaginationDifyAiDto extends HttpFetchDto {
  public static url = BASE_URL_AI + '/api/messages/pagination';
  public method = HttpMethod.GET;
  public url = GetMessagesByConversationIdPaginationDifyAiDto.url;
  public bodyDto = undefined;
  public paramsDto = undefined;
  public responseDto: GetMessagesByConversationIdPaginationDifyAiResponseDto;

  constructor(
    public queryDto: GetMessagesByConversationIdPaginationDifyAiQueryDto,
  ) {
    super();
  }
}
