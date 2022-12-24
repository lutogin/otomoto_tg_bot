import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context, Format, Markup } from 'telegraf';
import { get } from 'lodash';

import { MessagesMap } from '../messages/messages.map';
import { MessagesService } from '../messages/messages.service';
import { OtomotoService } from '../otomoto/otomoto.service';
import { SearchRequestsService } from '../search-requests/search-requests.service';

@Update()
@Injectable()
export class BotUpdate {
  private readonly LAST_RECORD_COUNT = 5;

  private readonly logger: Logger;

  constructor(
    private readonly msgService: MessagesService,
    private readonly searchRequestsService: SearchRequestsService,
    private readonly otomoto: OtomotoService,
  ) {
    this.logger = new Logger(BotUpdate.name);
  }
  @Start()
  async start(@Ctx() ctx: Context): Promise<void> {
    const lang = ctx.message.from.language_code;

    this.logger.log(`New user - ${ctx.message.from.id}`);

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
    const otomotoUrl = get(ctx, 'update.message.text');

    this.logger.log(`Setup link. Chat ID ${user.id}`);

    const result = await this.searchRequestsService.create({
      chatId: chat.id,
      userId: user.id,
      firstName: user.first_name,
      url: otomotoUrl,
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

    await ctx.reply(
      `Here is last ${this.LAST_RECORD_COUNT} articles from you url.`,
    );

    const articles = await this.otomoto.getArticles(
      otomotoUrl,
      this.LAST_RECORD_COUNT,
    );

    await ctx.replyWithPhoto(
      { url: articles[0].img },
      {
        caption: `<a href="${articles[0].link}">${articles[0].title}</a>
<b>Engine:</b> ${articles[0].engine}
<b>Mileage:</b> ${articles[0].mileage}`,
        parse_mode: 'HTML',
      },
    );
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
    this.logger.warn(`Unknown message handled. User ID ${ctx.message.from.id}`);

    await ctx.reply(
      this.msgService.makeMessage(
        MessagesMap.NotSupported,
        ctx.message.from.language_code,
      ),
    );
  }
}
