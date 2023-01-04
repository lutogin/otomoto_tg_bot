import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OtomotoClientService } from './otomoto-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
  ],
  providers: [OtomotoClientService],
  exports: [OtomotoClientService],
})
export class OtomotoClientModule {}
