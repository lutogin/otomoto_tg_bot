import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SearchRequest,
  SearchRequestsSchema,
} from './entities/schemas/search-request';
import { SearchRequestsRepository } from './repositories/search-requests.repository';
import { SearchRequestsService } from './search-requests.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchRequest.name, schema: SearchRequestsSchema },
    ]),
  ],
  providers: [SearchRequestsService, SearchRequestsRepository],
  exports: [SearchRequestsService],
})
export class SearchRequestsModule {}
