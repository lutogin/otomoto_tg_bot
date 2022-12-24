import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { BotModule } from './bot/bot.module';
import { SearchRequestsModule } from './search-requests/search-requests.module';
import { TasksModule } from './tasks/tasks.module';
import { OtomotoModule } from './otomoto/otomoto.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        autoIndex: false,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    BotModule,
    SearchRequestsModule,
    TasksModule,
    OtomotoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
