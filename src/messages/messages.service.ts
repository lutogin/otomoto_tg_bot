import { Injectable } from '@nestjs/common';
import { IMessage, Lang } from './messages.interfaces';

@Injectable()
export class MessagesService {
  makeMessage(message: IMessage, lang?: string): string {
    switch (lang) {
      case Lang.En:
        return message.en;

      case Lang.Pl:
        return message.pl;

      default:
        return `${message.pl} \n\n${message.en}`;
    }
  }
}
