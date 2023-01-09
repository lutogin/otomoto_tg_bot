import { SearchRequest } from '../../entities/schemas/search-request';

const record1 = {
  chatId: 123,
  userId: 'userId123',
  firstName: 'firstName',
  userName: 'userName',
  languageCode: 'en',
  url: 'http://localhost:8080',
  lastSeenArticleIds: ['123', '456', '789', '987', '654', '321'],
};

const record2 = {
  chatId: 456,
  userId: 'userId456',
  firstName: 'firstName',
  userName: 'userName',
  languageCode: 'en',
  url: 'http://localhost:8081',
  lastSeenArticleIds: ['111', '222', '333', '444', '555', '666'],
};

export class MockSearchRequestsService {
  findAll(): Promise<SearchRequest[]> {
    return Promise.resolve([record1, record2]);
  }

  findOne(): Promise<SearchRequest> {
    return Promise.resolve(record1);
  }
}
