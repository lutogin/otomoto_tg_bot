import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SearchRequests,
  SearchRequestsSchema,
} from './entities/schemas/search-requests';
import { SearchRequestsRepository } from './repositories/search-requests.repository';
import { SearchRequestsService } from './search-requests.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchRequests.name, schema: SearchRequestsSchema },
    ]),
  ],
  providers: [SearchRequestsService, SearchRequestsRepository],
  exports: [SearchRequestsService],
})
export class SearchRequestsModule {}
