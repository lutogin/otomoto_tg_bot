import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { from, merge, of } from 'rxjs';
import { concatMap, mergeMap } from 'rxjs/operators';
import { BotService } from '../bot/bot.service';
import { OtomotoService } from '../otomoto/otomoto.service';
import { SearchRequestsService } from '../search-requests/search-requests.service';

const cronTime = process.env.CRON_TIME || '*/15 * * * *';

@Injectable()
export class TasksServiceRxjs implements OnModuleInit {
  readonly logger: Logger;
  private defaultPageSize: number;

  constructor(
    private readonly searchRequests: SearchRequestsService,
    private readonly otomotoService: OtomotoService,
    private readonly bot: BotService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(TasksServiceRxjs.name);
    this.defaultPageSize = 36;
  }

  @Cron(cronTime)
  async handleCron(): Promise<void> {
    this.logger.log('Cron started.');

    try {
      const searchRequests = await this.searchRequests.findAll();

      if (!searchRequests) {
        this.logger.log('There are not any search requests.');

        return;
      }
      const pageSize =
        Number.parseInt(this.configService.get('OTOMOTO_PAGE_SIZE'), 10) ||
        this.defaultPageSize;

      merge(
        ...searchRequests.map((searchRequest) =>
          from(
            this.otomotoService.getArticles(searchRequest.url, pageSize),
          ).pipe(
            mergeMap((articles) => {
              const newArticles = articles.filter(
                (article) =>
                  !searchRequest.lastSeenArticleIds.includes(article.id),
              );

              if (!newArticles.length) {
                this.logger.log(
                  `No new article for @${searchRequest.userName}.`,
                );

                return of(null);
              }

              this.logger.log(
                `Found ${newArticles.length} new articles for @${searchRequest.userName}.`,
              );

              return from(newArticles).pipe(
                concatMap((article) =>
                  this.bot.sendArticle(searchRequest.chatId, article),
                ),
                mergeMap(() =>
                  this.searchRequests.update(searchRequest.chatId, {
                    lastSeenArticleIds: articles.map((article) => article.id),
                  }),
                ),
              );
            }),
          ),
        ),
      ).subscribe();
    } catch (e) {
      this.logger.error(e.message || e, e.stack);
      await this.bot.sendMessageToAdmin(`Error during cron: ${e.message}`);
    }
  }

  onModuleInit(): void {
    this.handleCron();
  }
}
