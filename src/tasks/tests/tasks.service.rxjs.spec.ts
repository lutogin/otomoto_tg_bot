import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { OtomotoService } from '../../otomoto/otomoto.service';
import { BotService } from '../../bot/bot.service';
import { SearchRequestsService } from '../../search-requests/search-requests.service';
import { TasksServiceRxjs } from '../tasks.service.rxjs';

describe('TasksServiceRxjs', () => {
  let service: TasksServiceRxjs;
  let searchRequestsService: {
    findAll: jest.Mock<any, any>;
    update: jest.Mock<any, any>;
  };
  let otomotoService: { getArticles: jest.Mock<any, any> };
  let botService: {
    sendMessageToAdmin: jest.Mock<any, any>;
    sendArticle: jest.Mock<any, any>;
  };
  let configService: { get: jest.Mock<any, any> };

  beforeEach(async () => {
    searchRequestsService = {
      findAll: jest.fn(),
      update: jest.fn(),
    };
    otomotoService = { getArticles: jest.fn() };
    botService = { sendArticle: jest.fn(), sendMessageToAdmin: jest.fn() };
    configService = { get: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksServiceRxjs,
        { provide: SearchRequestsService, useValue: searchRequestsService },
        { provide: OtomotoService, useValue: otomotoService },
        { provide: BotService, useValue: botService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<TasksServiceRxjs>(TasksServiceRxjs);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCron', () => {
    it('should handle no search requests', async () => {
      searchRequestsService.findAll.mockResolvedValueOnce(null);
      const logger = jest.spyOn(service.logger, 'log');

      await service.handleCron();

      expect(logger).toBeCalledWith('There are not any search requests.');
    });

    it('should handle new articles', async () => {
      searchRequestsService.findAll.mockResolvedValueOnce([
        {
          chatId: '123',
          userName: 'testuser',
          url: 'http://test.com',
          lastSeenArticleIds: ['123'],
        },
      ]);
      configService.get.mockReturnValueOnce('');
      otomotoService.getArticles.mockResolvedValueOnce([
        { id: '456' },
        { id: '789' },
      ]);
      const logger = jest.spyOn(service.logger, 'log');

      await service.handleCron();

      expect(logger).toBeCalledWith('Found 2 new articles for @testuser.');
      expect(botService.sendArticle).toBeCalledWith('123', { id: '456' });
      expect(botService.sendArticle).toBeCalledWith('123', { id: '789' });
      expect(searchRequestsService.update).toBeCalledWith('123', {
        lastSeenArticleIds: ['456', '789'],
      });
    });

    it('should handle no new articles', async () => {
      searchRequestsService.findAll.mockResolvedValueOnce([
        {
          chatId: '123',
          userName: 'testuser',
          url: 'http://test.com',
          lastSeenArticleIds: ['456', '789'],
        },
      ]);
      configService.get.mockReturnValueOnce('');
      otomotoService.getArticles.mockResolvedValueOnce([
        { id: '456' },
        { id: '789' },
      ]);
      const logger = jest.spyOn(service.logger, 'log');

      await service.handleCron();

      expect(logger).toBeCalledWith('No new article for @testuser.');
      expect(botService.sendArticle).not.toBeCalled();
      expect(searchRequestsService.update).not.toBeCalled();
    });

    it('should handle errors', async () => {
      searchRequestsService.findAll.mockResolvedValueOnce([
        {
          chatId: '123',
          userName: 'testuser',
          url: 'http://test.com',
          lastSeenArticleIds: ['456'],
        },
      ]);
      configService.get.mockReturnValueOnce('');

      const errorObj = new Error('Test error');

      otomotoService.getArticles.mockRejectedValueOnce(errorObj);
      const logger = jest.spyOn(service.logger, 'error');

      await service.handleCron();

      expect(logger).toBeCalledWith(errorObj.message);
      expect(botService.sendMessageToAdmin).toBeCalledWith(
        `Error during cron: ${errorObj.message}`,
      );
    });
  });
});
