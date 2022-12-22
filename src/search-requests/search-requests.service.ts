import { Injectable } from '@nestjs/common';
import { CreateSearchRequestDto } from './dto/create-search-request.dto';
import { UpdateSearchRequestDto } from './dto/update-search-request.dto';
import { SearchRequests } from './entities/schemas/search-requests';
import { IRepositoryResult } from './repositories/search-requests.interface';
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

  findAll(offset = 0): Promise<SearchRequests[]> {
    return this.searchRequestsRepository.findAll(offset);
  }

  findOne(chatId: number): Promise<SearchRequests> {
    return this.searchRequestsRepository.findOne(chatId);
  }

  update(
    chatId: number,
    updateSearchRequestDto: UpdateSearchRequestDto,
  ): Promise<IRepositoryResult> {
    return this.searchRequestsRepository.update(chatId, updateSearchRequestDto);
  }

  remove(chatId: number): Promise<any> {
    return this.searchRequestsRepository.remove(chatId);
  }
}
