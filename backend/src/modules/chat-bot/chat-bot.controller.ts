import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IChatBotService } from './chat-bot.interface';
import { INJECTION_TOKEN } from '@common/enums/injection-token';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ChatAiResponseDto, MessageDto } from './dtos/chat.dto';
import JwtAuthGuard from '@modules/auth/guard/jwtAuth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@entities';
import { Response } from 'express';
import { PageDto } from './dtos/page.dto';
import { PageMetaDto } from './dtos/page-meta.dto';
import { plainToInstance } from 'class-transformer';
import { ChatMessageItemDto } from './dtos/conversation.dto';

@ApiTags('ChatBot')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
@Controller('chat-bot')
export class ChatBotController {
  constructor(
    @Inject(INJECTION_TOKEN.CHAT_BOT_SERVICE)
    private readonly chatBotService: IChatBotService,
  ) {}

  @Post('blocking')
  @ApiOperation({ summary: 'Chat message blocking' })
  @ApiResponse({
    status: 200,
    description: 'Chat message blocking',
  })
  async chatMessageBlocking(
    @Body() body: MessageDto,
    @CurrentUser() user: User,
  ): Promise<ChatAiResponseDto> {
    return this.chatBotService.chatMessageBlocking(body.query, user.id);
  }

  @Post('streaming')
  @ApiOperation({ summary: 'Chat message streaming' })
  @ApiResponse({
    status: 200,
    description: 'Chat message streaming',
  })
  async chatMessageStreaming(
    @Body() body: MessageDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.chatBotService.chatMessageStreaming(
      body.query,
      user.id,
    );
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    result.pipe(res);

    result.on('end', () => {
      res.end();
    });
  }

  @Get('conversation')
  @ApiOperation({ summary: 'Get conversation' })
  @ApiResponse({
    status: 200,
    description: 'Get conversation',
  })
  async getConversation(
    @CurrentUser() user: User,
  ): Promise<PageDto<ChatMessageItemDto>> {
    const result = await this.chatBotService.getConversation(user.id);
    const pageMeta = new PageMetaDto({
      take: 10,
      page: 1,
      itemCount: result.total,
    });

    return new PageDto(
      plainToInstance(ChatMessageItemDto, result.data),
      pageMeta,
    );
  }
}
