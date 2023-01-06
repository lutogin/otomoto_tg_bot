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
import { BotSendMessageToAllDto } from './dto/bot.send-message-to-all.dto';

interface IHandled {
  handled: boolean;
}

@UseGuards(AuthGuard)
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('message/send/directly')
  @UsePipes(new ValidationPipe({ transform: true }))
  async sendDirectMessage(
    @Body() { chatId, message }: BotSendMessageDirectrlyDto,
  ): Promise<IHandled> {
    await this.botService.sendMessage(chatId, message);

    return { handled: true };
  }

  @Post('message/send/all')
  @UsePipes(new ValidationPipe({ transform: true }))
  sendMessageToAll(@Body() { message }: BotSendMessageToAllDto): IHandled {
    this.botService.sendMessageToAll(message);

    return { handled: true };
  }
}
