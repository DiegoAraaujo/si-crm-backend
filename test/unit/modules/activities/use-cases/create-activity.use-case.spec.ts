import { CreateActivityUseCase } from 'src/modules/activities/application/use-cases/create-activity.use-case';
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

describe('CreateActivityUseCase', () => {
  let useCase: CreateActivityUseCase;
  let activityRepository: jest.Mocked<IActivityRepository>;

  beforeEach(() => {
    activityRepository = makeActivityRepository();
    useCase = new CreateActivityUseCase(activityRepository);
  });

  it('should create and return the activity', async () => {
    const activity = makeActivity();
    activityRepository.create.mockResolvedValue(activity);

    const result = await useCase.execute({
      action: 'Lead created',
      leadId: 'lead-id-1',
      userId: 'user-id-123',
    });

    expect(result).toEqual(activity);
  });

  it('should call repository with correct data', async () => {
    activityRepository.create.mockResolvedValue(makeActivity());

    await useCase.execute({
      action: 'Lead created',
      leadId: 'lead-id-1',
      userId: 'user-id-123',
    });

    expect(activityRepository.create).toHaveBeenCalledWith({
      action: 'Lead created',
      leadId: 'lead-id-1',
      userId: 'user-id-123',
    });
  });

  it('should call repository exactly once', async () => {
    activityRepository.create.mockResolvedValue(makeActivity());

    await useCase.execute({
      action: 'Lead created',
      leadId: 'lead-id-1',
      userId: 'user-id-123',
    });

    expect(activityRepository.create).toHaveBeenCalledTimes(1);
  });
});
