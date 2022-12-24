import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { MessagesService } from '../messages/messages.service';
import { IArticle } from '../otomoto/otomoto-parser/otomoto-parser.interfaces';

Injectable();
export class BotService {
  constructor(
    @InjectBot('otomoto')
    private bot: Telegraf,
    private readonly msgService: MessagesService,
  ) {}

  async sendMessage(chatId: number, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message);
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