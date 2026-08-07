import { ListActivitiesUseCase } from 'src/modules/activities/application/use-cases/list-activities.use-case';
import { IActivityRepository } from 'src/modules/activities/domain/repositories/activity.repository.interface';
import { ActivityEntity } from 'src/modules/activities/domain/entities/activity.entity';

const makeActivity = (overrides?: Partial<ActivityEntity>): ActivityEntity =>
  new ActivityEntity(
    overrides?.id ?? 'activity-id-1',
    overrides?.action ?? 'Lead created',
    overrides?.leadId ?? 'lead-id-1',
    overrides?.userId ?? 'user-id-123',
    overrides?.createdAt ?? new Date('2024-01-01'),
  );

const makeActivityRepository = (): jest.Mocked<IActivityRepository> => ({
  findAll: jest.fn(),
  create: jest.fn(),
});

describe('ListActivitiesUseCase', () => {
  let useCase: ListActivitiesUseCase;
  let activityRepository: jest.Mocked<IActivityRepository>;

  beforeEach(() => {
    activityRepository = makeActivityRepository();
    useCase = new ListActivitiesUseCase(activityRepository);
  });

  describe('when listing all activities for a user', () => {
    it('should return all activities without leadId filter', async () => {
      const activities = [
        makeActivity(),
        makeActivity({ id: 'activity-id-2' }),
      ];
      activityRepository.findAll.mockResolvedValue(activities);

      const result = await useCase.execute({ userId: 'user-id-123' });

      expect(result).toEqual(activities);
      expect(activityRepository.findAll).toHaveBeenCalledWith(
        'user-id-123',
        undefined,
      );
    });

    it('should return empty array when user has no activities', async () => {
      activityRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute({ userId: 'user-id-123' });

      expect(result).toEqual([]);
    });
  });

  describe('when filtering by leadId', () => {
    it('should pass leadId to repository', async () => {
      activityRepository.findAll.mockResolvedValue([makeActivity()]);

      await useCase.execute({ userId: 'user-id-123', leadId: 'lead-id-1' });

      expect(activityRepository.findAll).toHaveBeenCalledWith(
        'user-id-123',
        'lead-id-1',
      );
    });

    it('should return only activities for the given lead', async () => {
      const activity = makeActivity({ leadId: 'lead-id-1' });
      activityRepository.findAll.mockResolvedValue([activity]);

      const result = await useCase.execute({
        userId: 'user-id-123',
        leadId: 'lead-id-1',
      });

      expect(result).toHaveLength(1);
      expect(result[0].leadId).toBe('lead-id-1');
    });
  });
});
