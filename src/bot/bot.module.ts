import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { MessagesModule } from '../messages/messages.module';
import { SearchRequestsModule } from '../search-requests/search-requests.module';
import { BotUpdate } from './bot.update';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    MessagesModule,
    SearchRequestsModule,
  ],
  providers: [BotUpdate],
})
export class BotModule {}
