import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { OtomotoClientService } from './otomoto-client.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [OtomotoClientService],
  exports: [OtomotoClientService],
})
export class OtomotoClientModule {}
