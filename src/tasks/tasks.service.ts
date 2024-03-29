import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { BotService } from '../bot/bot.service';
import { OtomotoService } from '../otomoto/otomoto.service';
import { SearchRequestsService } from '../search-requests/search-requests.service';
import { SearchRequest } from '../search-requests/entities/schemas/search-request';

const cronTime = process.env.CRON_TIME || '*/15 * * * *';

@Injectable()
export class TasksService implements OnModuleInit {
  readonly logger: Logger;
  private readonly defaultPageSize: number;
  private readonly LIMIT_ACCUM_ARTICLES = 144;

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
      let searchRequests: SearchRequest[];

      if (this.configService.get<string>('NODE_ENV') !== 'prod') {
        this.logger.debug('DEV MODE ON.');
        searchRequests = [
          await this.searchRequests.findOne(
            this.configService.get('ADMIN_CHAT_ID'),
          ),
        ];
      } else {
        searchRequests = await this.searchRequests.findAll();
      }

      if (!searchRequests) {
        this.logger.log('There are not any search requests.');

        return;
      }

      const pageSize =
        Number.parseInt(this.configService.get('OTOMOTO_PAGE_SIZE'), 10) ||
        this.defaultPageSize;

      await Promise.all(
        searchRequests.map(async (searchRequest) => {
          const articles = await this.otomotoService.getArticles(
            searchRequest.url,
            pageSize,
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

          try {
            await Promise.all(
              newArticles.map((article) =>
                this.bot.sendArticle(searchRequest.chatId, article),
              ),
            );
          } catch (e) {
            this.logger.error({
              code: e.code,
              statusCode: e.statusCode,
              message: e.message,
            });

            if ([HttpStatus.NOT_FOUND, HttpStatus.FORBIDDEN].includes(e.code)) {
              this.logger.warn(
                `Search request will be removed by ${e.statusCode}. [${searchRequest.chatId}]`,
              );

              await this.searchRequests.remove(searchRequest.chatId);
            }

            throw new Error(`${e.message}. ChatID: ${searchRequest.chatId}`);
          }

          const updateArticles = articles.map((article) => article.id);

          updateArticles.push(
            // eslint-disable-next-line no-extra-parens
            ...(searchRequest.lastSeenArticleIds.length >
            this.LIMIT_ACCUM_ARTICLES
              ? searchRequest.lastSeenArticleIds.slice(
                  0,
                  searchRequest.lastSeenArticleIds.length - articles.length,
                )
              : searchRequest.lastSeenArticleIds),
          );

          await this.searchRequests.update(searchRequest.chatId, {
            lastSeenArticleIds: updateArticles,
          });
        }),
      );
    } catch (e) {
      this.logger.error(e, e.stack);

      await this.bot.sendMessageToAdmin(`Error during cron: ${e.message}`);
    }
  }

  onModuleInit(): void {
    this.handleCron();
  }
}
