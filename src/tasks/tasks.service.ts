import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { BotService } from '../bot/bot.service';
import { OtomotoService } from '../otomoto/otomoto.service';
import { SearchRequestsService } from '../search-requests/search-requests.service';

const cronTime = process.env.CRON_TIME || '*/15 * * * *';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger: Logger;
  private defaultPageSize: number;

  constructor(
    private readonly searchRequests: SearchRequestsService,
    private readonly otomotoService: OtomotoService,
    private readonly bot: BotService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(TasksService.name);
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

      await Promise.all(
        searchRequests.map(async (searchRequest) => {
          const articles = await this.otomotoService.getArticles(
            searchRequest.url,
            Number.parseInt(this.configService.get('OTOMOTO_PAGE_SIZE'), 10) ||
              this.defaultPageSize,
          );

          if (!articles) {
            throw new Error(
              `Articles did not found found by url ${searchRequest.url}`,
            );
          }

          const newArticles = articles.filter(
            (article) => !searchRequest.lastSeenArticleIds.includes(article.id),
          );

          if (!newArticles.length) {
            this.logger.log(`No new article for @${searchRequest.userName}.`);

            return null;
          }

          this.logger.log(
            `Found ${newArticles.length} new articles for @${searchRequest.userName}.`,
          );

          await Promise.all(
            newArticles.map((article) =>
              this.bot.sendArticle(searchRequest.chatId, article),
            ),
          );

          await this.searchRequests.update(searchRequest.chatId, {
            lastSeenArticleIds: articles.map((article) => article.id),
          });
        }),
      );
    } catch (e) {
      this.logger.error(e.message || e, e.stack);

      await this.bot.sendMessageToAdmin(`Error during cron: ${e.message}`);
    }
  }

  onModuleInit(): void {
    this.handleCron();
  }
}
