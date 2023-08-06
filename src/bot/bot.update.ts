import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

import { MessagesMap } from '../messages/translations/messages.map';
import { BotCommands } from './bot.commands';

@Update()
@Injectable()
export class BotUpdate {
  private readonly logger: Logger;

  constructor(private readonly botCommands: BotCommands) {
    this.logger = new Logger(BotUpdate.name);
  }
  @Start()
  async start(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.start(ctx);
  }

  @Help()
  async help(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.help(ctx);
  }

  @Hears('stop')
  async stop(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.stop(ctx);
  }

  @On('sticker')
  async on(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.sticker(ctx);
  }

  @Hears(/^https:\/\/(w{3}\.)?otomoto\.pl\/osobowe.*$/u)
  async hears(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.uri(ctx);
  }

  @Hears(MessagesMap.Menu.Setup.en)
  @Hears(MessagesMap.Menu.Setup.pl)
  @Hears(MessagesMap.Menu.Setup.ua)
  async setupLink(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.setupLink(ctx);
  }

  @Hears(MessagesMap.Menu.Stop.en)
  @Hears(MessagesMap.Menu.Stop.pl)
  @Hears(MessagesMap.Menu.Stop.ua)
  async cancelSubscription(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.cancelSubscription(ctx);
  }

  @Hears(MessagesMap.Menu.GetLink.en)
  @Hears(MessagesMap.Menu.GetLink.pl)
  @Hears(MessagesMap.Menu.GetLink.ua)
  async getSubscriptionUrl(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.getSubscriptionUrl(ctx);
  }

  @Hears(/.*/u)
  async unknownCommand(@Ctx() ctx: Context): Promise<void> {
    await this.botCommands.unknownCommand(ctx);
  }
}
