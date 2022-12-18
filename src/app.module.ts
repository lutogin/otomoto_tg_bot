import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { BotModule } from './bot/bot.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    BotModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
