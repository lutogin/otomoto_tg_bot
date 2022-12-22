import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { get } from 'lodash';

import { MessagesMap } from '../messages/messages.map';
import { MessagesService } from '../messages/messages.service';
import { SearchRequestsService } from '../search-requests/search-requests.service';

@Update()
@Injectable()
export class BotUpdate {
  constructor(
    private readonly msgService: MessagesService,
    private readonly searchRequestsService: SearchRequestsService,
  ) {}
  @Start()
  async start(@Ctx() ctx: Context): Promise<void> {
    const lang = ctx.message.from.language_code;

    await ctx.reply(
      this.msgService.makeMessage(MessagesMap.Start, lang),
      Markup.keyboard([
        [this.msgService.makeMessage(MessagesMap.Menu.Setup, lang)],
        [this.msgService.makeMessage(MessagesMap.Menu.Stop, lang)],
      ]).resize(),
    );
  }

  @Help()
  async help(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply(this.msgService.makeMessage(MessagesMap.Help));
  }

  @Hears('stop')
  async stop(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply(this.msgService.makeMessage(MessagesMap.Stop));
  }

  @On('sticker')
  async on(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply('🤖');
  }

  @Hears(/^https:\/\/www\.otomoto\.pl\/.*$/u)
  async hears(@Ctx() ctx: Context): Promise<void> {
    const { chat, from: user } = ctx.message;
    const lang = ctx.message.from.language_code;

    const result = await this.searchRequestsService.create({
      chatId: chat.id,
      userId: user.id,
      firstName: user.first_name,
      url: get(ctx, 'update.message.text'),
      languageCode: lang,
    });

    if (result.upsertedCount) {
      await ctx.reply(
        this.msgService.makeMessage(
          MessagesMap.StartLooking,
          ctx.message.from.language_code,
        ),
      );
    } else {
      await ctx.reply(
        this.msgService.makeMessage(
          MessagesMap.StartLookingUpdatedUrl,
          ctx.message.from.language_code,
        ),
      );
    }
  }

  @Hears(MessagesMap.Menu.Setup.en)
  @Hears(MessagesMap.Menu.Setup.pl)
  async setupLink(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply(
      this.msgService.makeMessage(
        MessagesMap.OfferToSetUrl,
        ctx.message.from.language_code,
      ),
    );
  }

  @Hears(MessagesMap.Menu.Stop.en)
  @Hears(MessagesMap.Menu.Stop.pl)
  async cancelSubscription(@Ctx() ctx: Context): Promise<void> {
    const { chat } = ctx.message;

    await this.searchRequestsService.remove(chat.id);

    await ctx.reply(
      this.msgService.makeMessage(
        MessagesMap.Stop,
        ctx.message.from.language_code,
      ),
    );
  }

  @Hears(/.*/u)
  async unknownCommand(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply(
      this.msgService.makeMessage(
        MessagesMap.NotSupported,
        ctx.message.from.language_code,
      ),
    );
  }
}
