import { Injectable } from '@nestjs/common';
import { IArticle } from '../otomoto/otomoto-parser/otomoto-parser.interfaces';
import { IMessage, Lang } from './messages.interfaces';

@Injectable()
export class MessagesService {
  makeMessage(message: IMessage, lang?: string): string {
    switch (lang) {
      case Lang.Pl:
        return message.pl;

      case Lang.En:
        return message.en;

      case Lang.Ua:
        return message.ua;

      case Lang.Ru:
        return message.ua;

      default:
        return message.en;
    }
  }

  fmtCaption(article: IArticle): string {
    let result = `<a href="${article.link}">${article.title}</a>
<b>📝 Description:</b> ${article.description}\n
<b>🗓️ Year:</b> ${article.year}
<b>📊 Engine:</b> ${article.engine}
<b>⛽ FuelType:</b> ${article.fuelType}
<b>🛣️ Mileage:</b> ${article.mileage}`;

    if (article.location) {
      result += `\n<b>📍 Location:</b> ${article.location}`;
    }

    if (article.date) {
      result += `\n<b>📅 Date:</b> ${article.date}`;
    }

    return result;
  }
}
