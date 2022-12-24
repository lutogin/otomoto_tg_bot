import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { last } from 'lodash';
import { BotService } from '../bot/bot.service';
import { OtomotoService } from '../otomoto/otomoto.service';
import { SearchRequestsService } from '../search-requests/search-requests.service';

const cronTime = process.env.CRON_TIME || '*/10 * * * *';

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
              36,
          );

          if (!articles) {
            throw new Error('Articles did not found found.');
          }

          const lastSeenArticleIndex = articles.findIndex(
            (article) => article.id === searchRequest.lastSeenArticleId,
          );

          if (lastSeenArticleIndex <= 0) {
            this.logger.log(`No new article for ${searchRequest.userName}.`);

            return null;
          }

          const newArticles = articles.slice(0, lastSeenArticleIndex);

          this.logger.log(
            `Found ${newArticles.length} new articles for ${searchRequest.userName}.`,
          );

          await Promise.all(
            newArticles
              .reverse()
              .map((article) =>
                this.bot.sendArticle(searchRequest.chatId, article),
              ),
          );

          await this.searchRequests.update(searchRequest.chatId, {
            lastSeenArticleId: last(newArticles).id,
          });
        }),
      );
    } catch (e) {
      this.logger.error(e.message || e, e.stack);

      await this.bot.sendMessageToAdmin(`Error during cron: ${e.message}`);
    }
  }
}
