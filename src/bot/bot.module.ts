import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { MessagesModule } from '../messages/messages.module';
import { OtomotoModule } from '../otomoto/otomoto.module';
import { SearchRequestsModule } from '../search-requests/search-requests.module';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { BotController } from './bot.controller';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      botName: 'otomoto',
      useFactory: (configService: ConfigService) => ({
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
      }),
      inject: [ConfigService],
    }),
    MessagesModule,
    SearchRequestsModule,
    OtomotoModule,
  ],
  providers: [BotUpdate, BotService],
  exports: [BotService],
  controllers: [BotController],
})
export class BotModule {}
