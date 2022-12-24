import { Injectable, Logger } from '@nestjs/common';
import { OtomotoClientService } from './otomoto-client/otomoto-client.service';
import { IArticle } from './otomoto-parser/otomoto-parser.interfaces';
import { OtomotoParserService } from './otomoto-parser/otomoto-parser.service';

@Injectable()
export class OtomotoService {
  private readonly logger: Logger;
  constructor(
    private readonly client: OtomotoClientService,
    private readonly parser: OtomotoParserService,
  ) {
    this.logger = new Logger(OtomotoService.name);
  }

  async getArticles(url: string, last = 36): Promise<IArticle[]> {
    try {
      const html = await this.client.makeRequest(url);

      return this.parser.parse(html, last);
    } catch (e) {
      this.logger.error(e.message || e);

      throw e;
    }
  }
}
