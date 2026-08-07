import { ListStatusesUseCase } from 'src/modules/statuses/application/use-cases/list-statuses.use-case';
import { IStatusRepository } from 'src/modules/statuses/domain/repositories/status.repository.interface';
import { StatusEntity } from 'src/modules/statuses/domain/entities/status.entity';

const makeStatus = (overrides?: Partial<StatusEntity>): StatusEntity =>
  new StatusEntity(
    overrides?.id ?? 'status-id-1',
    overrides?.name ?? 'New',
    overrides?.color ?? '#3B82F6',
    overrides?.order ?? 0,
    overrides?.isDefault ?? false,
    overrides?.userId ?? 'user-id-123',
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.updatedAt ?? new Date('2024-01-01'),
  );

const makeStatusRepository = (): jest.Mocked<IStatusRepository> => ({
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  findDefaultByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ListStatusesUseCase', () => {
  let useCase: ListStatusesUseCase;
  let statusRepository: jest.Mocked<IStatusRepository>;

  beforeEach(() => {
    statusRepository = makeStatusRepository();
    useCase = new ListStatusesUseCase(statusRepository);
  });

  it('should return all statuses for the user', async () => {
    const statuses = [
      makeStatus(),
      makeStatus({ id: 'status-id-2', order: 1 }),
    ];
    statusRepository.findAllByUserId.mockResolvedValue(statuses);

    const result = await useCase.execute('user-id-123');

    expect(result).toEqual(statuses);
    expect(statusRepository.findAllByUserId).toHaveBeenCalledWith(
      'user-id-123',
    );
  });

  it('should return empty array when user has no statuses', async () => {
    statusRepository.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute('user-id-123');

    expect(result).toEqual([]);
  });
});
