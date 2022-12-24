import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSearchRequestDto } from '../dto/create-search-request.dto';
import { UpdateSearchRequestDto } from '../dto/update-search-request.dto';
import {
  SearchRequest,
  SearchRequestsDocument,
} from '../entities/schemas/search-request';
import { IRepositoryResult } from '../search-requests.interface';

@Injectable()
export class SearchRequestsRepository {
  constructor(
    @InjectModel(SearchRequest.name)
    private searchRequestsModel: Model<SearchRequestsDocument>,
  ) {}

  async create(payload: CreateSearchRequestDto): Promise<IRepositoryResult> {
    return this.searchRequestsModel.updateOne(
      {
        chatId: payload.chatId,
        userId: payload.userId,
      },
      payload,
      { upsert: true },
    );
  }

  async findAll(offset = 0, limit = 5000): Promise<SearchRequest[]> {
    return (
      await this.searchRequestsModel
        .find(
          {},
          [
            'chatId',
            'userId',
            'firstName',
            'languageCode',
            'url',
            'lastSeenArticleId',
          ],
          {
            skip: offset,
            limit,
            sort: {
              createdAt: 'asc',
            },
          },
        )
        .exec()
    ).map((el) => el.toObject());
  }

  async findOne(chatId: number): Promise<SearchRequest> {
    return (
      await this.searchRequestsModel.findOne({ chatId }).exec()
    ).toObject();
  }

  update(
    chatId: number,
    data: UpdateSearchRequestDto,
  ): Promise<IRepositoryResult> {
    return this.searchRequestsModel.updateOne({ chatId }, data).exec();
  }

  remove(chatId: number): Promise<any> {
    return this.searchRequestsModel.findOneAndRemove({ chatId }).exec();
  }
}
