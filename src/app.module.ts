import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
