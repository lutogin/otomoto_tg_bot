import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { MessagesService } from '../messages/messages.service';
import { IArticle } from '../otomoto/otomoto-parser/otomoto-parser.interfaces';

Injectable();
export class BotService {
  private adminChatId: number;

  constructor(
    @InjectBot('otomoto')
    private bot: Telegraf,
    private readonly msgService: MessagesService,
    private readonly configService: ConfigService,
  ) {
    this.adminChatId = Number.parseInt(
      this.configService.get('ADMIN_CHAT_ID'),
      10,
    );
  }

  async sendMessage(chatId: number, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message);
  }

  async sendMessageToAdmin(msg: string) {
    await this.sendMessage(this.adminChatId, msg);
  }

  async sendArticle(chatId: number, article: IArticle): Promise<void> {
    await this.bot.telegram.sendPhoto(
      chatId,
      { url: article.img },
      {
        caption: this.msgService.fmtCaption(article),
        parse_mode: 'HTML',
      },
    );
  }
}
