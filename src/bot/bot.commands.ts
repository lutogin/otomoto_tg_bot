import { Injectable, Logger } from '@nestjs/common';
import { get } from 'lodash';
import { Ctx } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { IRepositoryResult } from '../search-requests/search-requests.interface';
import { BotService } from './bot.service';
import { MessagesService } from '../messages/messages.service';
import { SearchRequestsService } from '../search-requests/search-requests.service';
import { OtomotoService } from '../otomoto/otomoto.service';
import { MessagesMap } from '../messages/translations/messages.map';

@Injectable()
export class BotCommands {
  private readonly LAST_RECORD_COUNT = 5;
  private readonly logger: Logger;

  constructor(
    private readonly msgService: MessagesService,
    private readonly searchRequestsService: SearchRequestsService,
    private readonly otomoto: OtomotoService,
    private readonly bot: BotService,
  ) {
    this.logger = new Logger(BotCommands.name);
  }

  start(@Ctx() ctx: Context): Promise<any> {
    const lang = ctx.message.from.language_code;

    this.logger.log(`New user - ${ctx.message.from.username}`);

    return ctx.reply(
      this.msgService.makeMessage(MessagesMap.Start, lang),
      Markup.keyboard([
        [this.msgService.makeMessage(MessagesMap.Menu.Setup, lang)],
        [this.msgService.makeMessage(MessagesMap.Menu.GetLink, lang)],
        [this.msgService.makeMessage(MessagesMap.Menu.Stop, lang)],
      ]).resize(),
    );
  }

  help(@Ctx() ctx: Context): Promise<any> {
    return ctx.reply(this.msgService.makeMessage(MessagesMap.Help));
  }

  stop(@Ctx() ctx: Context): Promise<any> {
    return ctx.reply(this.msgService.makeMessage(MessagesMap.Stop));
  }

  sticker(ctx: Context): Promise<any> {
    return ctx.reply('🤖');
  }

  async uri(ctx: Context): Promise<void> {
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

      if (!articles || !articles?.length) {
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

      await Promise.all(
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

  async setupLink(ctx: Context): Promise<void> {
    await ctx.reply(
      this.msgService.makeMessage(
        MessagesMap.OfferToSetUrl,
        ctx.message.from.language_code,
      ),
    );
  }

  async cancelSubscription(ctx: Context): Promise<any> {
    const { chat } = ctx.message;

    await this.searchRequestsService.remove(chat.id);

    await ctx.reply(
      this.msgService.makeMessage(
        MessagesMap.Stop,
        ctx.message.from.language_code,
      ),
    );
  }

  async getSubscriptionUrl(ctx: Context): Promise<void> {
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

  async unknownCommand(ctx: Context): Promise<void> {
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
