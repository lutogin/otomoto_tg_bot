import { Module } from '@nestjs/common';
import { OtomotoClientModule } from '../otomoto-client/otomoto-client.module';
import { OtomotoParserService } from './otomoto-parser.service';

@Module({
  imports: [OtomotoClientModule],
  providers: [OtomotoParserService],
  exports: [OtomotoParserService],
})
export class OtomotoParserModule {}
