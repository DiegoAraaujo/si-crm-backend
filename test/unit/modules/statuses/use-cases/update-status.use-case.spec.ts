import { UpdateStatusUseCase } from 'src/modules/statuses/application/use-cases/update-status.use-case';
import { IStatusRepository } from 'src/modules/statuses/domain/repositories/status.repository.interface';
import { StatusEntity } from 'src/modules/statuses/domain/entities/status.entity';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';

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

describe('UpdateStatusUseCase', () => {
  let useCase: UpdateStatusUseCase;
  let statusRepository: jest.Mocked<IStatusRepository>;

  beforeEach(() => {
    statusRepository = makeStatusRepository();
    useCase = new UpdateStatusUseCase(statusRepository);
  });

  describe('when status exists and belongs to user', () => {
    it('should update and return the status', async () => {
      const updated = makeStatus({ name: 'In Progress' });
      statusRepository.findById.mockResolvedValue(makeStatus());
      statusRepository.update.mockResolvedValue(updated);

      const result = await useCase.execute({
        id: 'status-id-1',
        userId: 'user-id-123',
        name: 'In Progress',
      });

      expect(result).toEqual(updated);
    });

    it('should call update with correct id and fields', async () => {
      statusRepository.findById.mockResolvedValue(makeStatus());
      statusRepository.update.mockResolvedValue(makeStatus());

      await useCase.execute({
        id: 'status-id-1',
        userId: 'user-id-123',
        name: 'In Progress',
        color: '#10B981',
        order: 2,
      });

      expect(statusRepository.update).toHaveBeenCalledWith('status-id-1', {
        name: 'In Progress',
        color: '#10B981',
        order: 2,
      });
    });
  });

  describe('when status does not exist', () => {
    it('should throw STATUS_NOT_FOUND', async () => {
      statusRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ id: 'unknown-id', userId: 'user-id-123' }),
      ).rejects.toThrow(AppErrors.STATUS_NOT_FOUND);

      expect(statusRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('when status belongs to another user', () => {
    it('should throw STATUS_NOT_FOUND', async () => {
      statusRepository.findById.mockResolvedValue(
        makeStatus({ userId: 'another-user-id' }),
      );

      await expect(
        useCase.execute({ id: 'status-id-1', userId: 'user-id-123' }),
      ).rejects.toThrow(AppErrors.STATUS_NOT_FOUND);

      expect(statusRepository.update).not.toHaveBeenCalled();
    });
  });
});
