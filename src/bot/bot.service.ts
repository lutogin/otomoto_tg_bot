import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

Injectable();
export class BotService {
  constructor(
    @InjectBot('otomoto')
    private bot: Telegraf,
  ) {}

  async sendMessage(chatId: number, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message);
  }
}
