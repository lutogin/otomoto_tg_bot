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
    return `<a href="${article.link}">${article.title}</a>
<b>💰 Price: </b> ${article.price}
<b>🗓️ Year:</b> ${article.year}
<b>⏱️ Mileage:</b> ${article.mileage}
<b>🚂 Engine:</b> ${article.engine}
<b>⚡ Power:</b> ${article.power}
<b>⚙️ Gearbox:</b> ${article.gearbox}
<b>⛽ FuelType:</b> ${article.fuelType}
<b>📝 Description:</b> ${article.description?.slice(0, 100)}
`;
  }
}
