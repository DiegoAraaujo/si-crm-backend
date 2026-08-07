import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from 'src/modules/activities/presentation/activities.controller';
import { ListActivitiesUseCase } from 'src/modules/activities/application/use-cases/list-activities.use-case';
import { ActivityEntity } from 'src/modules/activities/domain/entities/activity.entity';
import { Request } from 'express';

const makeRequest = (userId = 'user-id-123'): Partial<Request> => ({
  user: { id: userId },
});

const makeActivity = (): ActivityEntity =>
  new ActivityEntity(
    'activity-id-1',
    'Lead created',
    'lead-id-1',
    'user-id-123',
    new Date('2024-01-01'),
  );

describe('ActivitiesController', () => {
  let controller: ActivitiesController;
  let listActivitiesUseCase: jest.Mocked<ListActivitiesUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        { provide: ListActivitiesUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    listActivitiesUseCase = module.get(ListActivitiesUseCase);
  });

  describe('GET /activities', () => {
    it('should call ListActivitiesUseCase with userId and no leadId', async () => {
      listActivitiesUseCase.execute.mockResolvedValue([]);

      await controller.list(makeRequest() as Request);

      expect(listActivitiesUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id-123',
        leadId: undefined,
      });
    });

    it('should call ListActivitiesUseCase with userId and leadId when provided', async () => {
      listActivitiesUseCase.execute.mockResolvedValue([]);

      await controller.list(makeRequest() as Request, 'lead-id-1');

      expect(listActivitiesUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id-123',
        leadId: 'lead-id-1',
      });
    });

    it('should return the output from ListActivitiesUseCase', async () => {
      const activities = [makeActivity()];
      listActivitiesUseCase.execute.mockResolvedValue(activities);

      const result = await controller.list(makeRequest() as Request);

      expect(result).toEqual(activities);
    });
  });
});
