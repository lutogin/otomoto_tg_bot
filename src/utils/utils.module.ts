import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilsService } from './utils.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
