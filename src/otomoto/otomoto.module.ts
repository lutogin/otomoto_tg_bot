import { Module } from '@nestjs/common';
import { OtomotoService } from './otomoto.service';
import { OtomotoClientModule } from './otomoto-client/otomoto-client.module';
import { OtomotoParserModule } from './otomoto-parser/otomoto-parser.module';

@Module({
  imports: [OtomotoClientModule, OtomotoParserModule],
  providers: [OtomotoService],
  exports: [OtomotoService],
})
export class OtomotoModule {}
