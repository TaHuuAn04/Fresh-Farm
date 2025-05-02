import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
