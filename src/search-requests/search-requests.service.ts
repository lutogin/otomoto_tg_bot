import { Injectable } from '@nestjs/common';
import { CreateSearchRequestDto } from './dto/create-search-request.dto';
import { UpdateSearchRequestDto } from './dto/update-search-request.dto';
import { SearchRequest } from './entities/schemas/search-request';
import { IRepositoryResult } from './search-requests.interface';
import { SearchRequestsRepository } from './repositories/search-requests.repository';

@Injectable()
export class SearchRequestsService {
  constructor(
    private readonly searchRequestsRepository: SearchRequestsRepository,
  ) {}

  create(
    createSearchRequestDto: CreateSearchRequestDto,
  ): Promise<IRepositoryResult> {
    return this.searchRequestsRepository.create(createSearchRequestDto);
  }

  findAll(offset = 0): Promise<SearchRequest[]> {
    return this.searchRequestsRepository.findAll(offset);
  }

  findOne(chatId: number): Promise<SearchRequest> {
    return this.searchRequestsRepository.findOne(chatId);
  }

  update(
    chatId: number,
    updateSearchRequestDto: UpdateSearchRequestDto,
  ): Promise<IRepositoryResult> {
    return this.searchRequestsRepository.update(chatId, updateSearchRequestDto);
  }

  remove(chatId: number): Promise<SearchRequest> {
    return this.searchRequestsRepository.remove(chatId);
  }
}
