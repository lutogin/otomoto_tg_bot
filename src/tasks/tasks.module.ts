import { Module } from '@nestjs/common';
import { BotModule } from '../bot/bot.module';
import { OtomotoModule } from '../otomoto/otomoto.module';
import { SearchRequestsModule } from '../search-requests/search-requests.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [SearchRequestsModule, OtomotoModule, BotModule],
  providers: [TasksService],
})
export class TasksModule {}
