import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { BotService } from '../bot/bot.service';
import { OtomotoService } from '../otomoto/otomoto.service';
import { SearchRequestsService } from '../search-requests/search-requests.service';

@Injectable()
export class TasksService {
  private readonly logger: Logger;

  constructor(
    private readonly searchRequests: SearchRequestsService,
    private readonly otomotoService: OtomotoService,
    private readonly bot: BotService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(TasksService.name);
  }

  @Cron('*/5 * * * *')
  async handleCron() {
    const searchRequests = await this.searchRequests.findAll();

    this.logger.log('Cron is started.');

    try {
      await Promise.all(
        searchRequests.map(async (searchRequest) => {
          const articles = await this.otomotoService.getArticles(
            searchRequest.url,
            Number.parseInt(this.configService.get('OTOMOTO_PAGE_SIZE'), 10) ||
              36,
          );

          const newArticles = articles.slice(
            0,
            articles.findIndex(
              (article) => article.id === searchRequest.lastSeenArticleId,
            ),
          );

          if (!newArticles.length) {
            this.logger.log(`No new article for ${searchRequest.chatId}.`);

            return null;
          }

          this.logger.log(
            `Found ${newArticles.length} new articles for ${searchRequest.chatId}.`,
          );

          await Promise.all(
            newArticles.map((article) =>
              this.bot.sendArticle(searchRequest.chatId, article),
            ),
          );

          await this.searchRequests.update(searchRequest.chatId, {
            lastSeenArticleId: newArticles[0].id,
          });
        }),
      );
    } catch (e) {
      this.logger.error(e.message || e, e.stack);
    }
  }
}
