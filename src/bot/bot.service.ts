import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { MessagesService } from '../messages/messages.service';
import { IArticle } from '../otomoto/otomoto-parser/otomoto-parser.interfaces';
import { SearchRequestsService } from '../search-requests/search-requests.service';
import { UtilsService } from '../utils/utils.service';

Injectable();
export class BotService {
  private adminChatId: number;
  private readonly fallBackImg =
    'https://www.creativefabrica.com/wp-content/uploads/2020/09/02/Auto-car-logo-design-Graphics-5237528-1-580x387.jpg';

  constructor(
    @InjectBot('otomoto')
    private bot: Telegraf,
    private readonly msgService: MessagesService,
    private readonly configService: ConfigService,
    private readonly searchRequestsService: SearchRequestsService,
    private readonly utilsService: UtilsService,
  ) {
    this.adminChatId = Number.parseInt(
      this.configService.get('ADMIN_CHAT_ID'),
      10,
    );
  }

  async sendMessage(chatId: number, message: string): Promise<void> {
    await this.bot.telegram.sendMessage(chatId, message);
  }

  async sendMessageToAdmin(msg: string): Promise<void> {
    await this.sendMessage(this.adminChatId, msg);
  }

  async sendArticle(chatId: number, article: IArticle): Promise<void> {
    let photo: { source?: Buffer; url?: string };

    try {
      const file = await this.utilsService.getImageBuffer(article.img);

      photo = { source: file };
    } catch (e) {
      console.error(`Error with link or file. ${article.img}`);

      if (e.statusCode === HttpStatus.NOT_FOUND || !article.img) {
        console.debug(
          `Original photo (${article.img}) was not found. Added fallback img.`,
        );
        photo = { url: this.fallBackImg };
      } else {
        throw e;
      }
    }

    await this.bot.telegram.sendPhoto(chatId, photo as unknown as any, {
      caption: this.msgService.fmtCaption(article),
      parse_mode: 'HTML',
    });
  }

  async sendMessageToAll(
    message: string,
  ): Promise<PromiseSettledResult<void>[]> {
    const searchRequests = await this.searchRequestsService.findAll();

    return Promise.allSettled(
      searchRequests.map((searchRequest) =>
        this.sendMessage(searchRequest.chatId, message),
      ),
    );
  }
}
