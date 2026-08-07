import { CreateStatusUseCase } from 'src/modules/statuses/application/use-cases/create-status.use-case';
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

describe('CreateStatusUseCase', () => {
  let useCase: CreateStatusUseCase;
  let statusRepository: jest.Mocked<IStatusRepository>;

  beforeEach(() => {
    statusRepository = makeStatusRepository();
    useCase = new CreateStatusUseCase(statusRepository);
  });

  it('should create and return the status', async () => {
    const status = makeStatus();
    statusRepository.create.mockResolvedValue(status);

    const result = await useCase.execute({
      name: 'New',
      color: '#3B82F6',
      order: 0,
      userId: 'user-id-123',
    });

    expect(result).toEqual(status);
  });

  it('should call repository with correct data', async () => {
    statusRepository.create.mockResolvedValue(makeStatus());

    await useCase.execute({
      name: 'New',
      color: '#3B82F6',
      order: 0,
      userId: 'user-id-123',
    });

    expect(statusRepository.create).toHaveBeenCalledWith({
      name: 'New',
      color: '#3B82F6',
      order: 0,
      userId: 'user-id-123',
    });
  });
});
