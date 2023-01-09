import { Test } from '@nestjs/testing';
import { OtomotoService } from '../../otomoto/otomoto.service';
import { SearchRequestsService } from '../../search-requests/search-requests.service';
import { MockSearchRequestsService } from '../../search-requests/tests/mocks/search-requests.mock';
import { TasksService } from '../tasks.service';

describe('CatsController', () => {
  let tasksService: TasksService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: SearchRequestsService,
          useClass: MockSearchRequestsService,
        },
        {
          provide: OtomotoService,
          useClass:
        }
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];

      jest.spyOn(tasksService, 'handleCron').mockImplementation(() => null);

      expect(await tasksService.handleCron()).toBe(result);
    });
  });
});
