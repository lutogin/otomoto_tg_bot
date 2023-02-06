import { Injectable, Logger } from '@nestjs/common';
import { Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { get } from 'lodash';

import { MessagesMap } from '../messages/messages.map';
import { MessagesService } from '../messages/messages.service';
import { OtomotoService } from '../otomoto/otomoto.service';
import { IRepositoryResult } from '../search-requests/search-requests.interface';
import { SearchRequestsService } from '../search-requests/search-requests.service';
import { BotService } from './bot.service';

@Update()
@Injectable()
export class BotUpdate {
  private readonly LAST_RECORD_COUNT = 5;

  private readonly logger: Logger;

  constructor(
    private readonly msgService: MessagesService,
    private readonly searchRequestsService: SearchRequestsService,
    private readonly otomoto: OtomotoService,
    private readonly bot: BotService,
  ) {
    this.logger = new Logger(BotUpdate.name);
  }
  @Start()
  async start(@Ctx() ctx: Context): Promise<void> {
    const lang = ctx.message.from.language_code;

    this.logger.log(`New user - ${ctx.message.from.username}`);

    await ctx.reply(
      this.msgService.makeMessage(MessagesMap.Start, lang),
      Markup.keyboard([
        [this.msgService.makeMessage(MessagesMap.Menu.Setup, lang)],
        [this.msgService.makeMessage(MessagesMap.Menu.GetLink, lang)],
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

  @Hears(/^https:\/\/(w{3}\.)?otomoto\.pl\/osobowe.*$/u)
  async hears(@Ctx() ctx: Context): Promise<void> {
    try {
      const { chat, from: user } = ctx.message;
      const lang = ctx.message.from.language_code;
      const otomotoUrl = get(ctx, 'update.message.text', '').replace(
        /&page=\d/mu,
        '',
      );

      this.logger.log(`Setup link. Chat ID ${user.username}`);

      await ctx.reply(this.msgService.makeMessage(MessagesMap.Wait, lang));

      const articles = await this.otomoto.getArticles(otomotoUrl);

      if (!articles) {
        await ctx.reply(
          this.msgService.makeMessage(MessagesMap.WrongLink, lang),
        );

        return;
      }

      const result = await this.searchRequestsService.create({
        chatId: chat.id,
        userId: user.id,
        firstName: user.first_name,
        userName: user.username,
        url: otomotoUrl,
        languageCode: lang,
        lastSeenArticleIds: articles.map((article) => article.id),
      });

      await ctx.reply(
        this.msgService.makeMessage(MessagesMap.LastArticles, lang),
      );

      await Promise.allSettled(
        articles
          .slice(0, this.LAST_RECORD_COUNT)
          .reverse()
          .map((article) =>
            ctx.replyWithPhoto(
              { url: article.img },
              {
                caption: this.msgService.fmtCaption(article),
                parse_mode: 'HTML',
              },
            ),
          ),
      );

      await this.sendUpdateOrCreateUrlMessage(result, ctx);
    } catch (e) {
      this.logger.error(e.message || e, e.stack);

      await this.bot.sendMessageToAdmin(`Bot error at update: ${e.message}`);
    }
  }

  @Hears(MessagesMap.Menu.Setup.en)
  @Hears(MessagesMap.Menu.Setup.pl)
  @Hears(MessagesMap.Menu.Setup.ua)
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
  @Hears(MessagesMap.Menu.Stop.ua)
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

  @Hears(MessagesMap.Menu.GetLink.en)
  @Hears(MessagesMap.Menu.GetLink.pl)
  @Hears(MessagesMap.Menu.GetLink.ua)
  async getSubscriptionUrl(@Ctx() ctx: Context): Promise<void> {
    const { chat } = ctx.message;

    const url = get(await this.searchRequestsService.findOne(chat.id), 'url');

    if (url) {
      await ctx.reply(url);
    } else {
      await ctx.reply(
        this.msgService.makeMessage(
          MessagesMap.LinkNotFound,
          ctx.message.from.language_code,
        ),
      );
    }
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

  private async sendUpdateOrCreateUrlMessage(
    result: IRepositoryResult,
    ctx: Context,
  ): Promise<void> {
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
}
