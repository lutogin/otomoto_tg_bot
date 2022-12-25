import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from './bot.guard';
import { BotService } from './bot.service';
import { BotSendMessageDirectrlyDto } from './dto/bot.send-message-directrly.dto';

@UseGuards(AuthGuard)
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('message/send/directly')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendDirectMessage(
    @Body() { chatId, message }: BotSendMessageDirectrlyDto,
  ): Promise<void> {
    await this.botService.sendMessage(chatId, message);
  }
}
