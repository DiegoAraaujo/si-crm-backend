import { DeleteStatusUseCase } from 'src/modules/statuses/application/use-cases/delete-status.use-case';
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

describe('DeleteStatusUseCase', () => {
  let useCase: DeleteStatusUseCase;
  let statusRepository: jest.Mocked<IStatusRepository>;

  beforeEach(() => {
    statusRepository = makeStatusRepository();
    useCase = new DeleteStatusUseCase(statusRepository);
  });

  describe('when status exists and is not default', () => {
    it('should delete the status', async () => {
      statusRepository.findById.mockResolvedValue(makeStatus());

      await useCase.execute({ id: 'status-id-1', userId: 'user-id-123' });

      expect(statusRepository.delete).toHaveBeenCalledWith('status-id-1');
    });

    it('should return void', async () => {
      statusRepository.findById.mockResolvedValue(makeStatus());

      const result = await useCase.execute({
        id: 'status-id-1',
        userId: 'user-id-123',
      });

      expect(result).toBeUndefined();
    });
  });

  describe('when status does not exist', () => {
    it('should throw STATUS_NOT_FOUND without calling delete', async () => {
      statusRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ id: 'unknown-id', userId: 'user-id-123' }),
      ).rejects.toThrow(AppErrors.STATUS_NOT_FOUND);

      expect(statusRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('when status belongs to another user', () => {
    it('should throw STATUS_NOT_FOUND without calling delete', async () => {
      statusRepository.findById.mockResolvedValue(
        makeStatus({ userId: 'another-user-id' }),
      );

      await expect(
        useCase.execute({ id: 'status-id-1', userId: 'user-id-123' }),
      ).rejects.toThrow(AppErrors.STATUS_NOT_FOUND);

      expect(statusRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('when status is default', () => {
    it('should throw STATUS_DEFAULT_DELETE without calling delete', async () => {
      statusRepository.findById.mockResolvedValue(
        makeStatus({ isDefault: true }),
      );

      await expect(
        useCase.execute({ id: 'status-id-1', userId: 'user-id-123' }),
      ).rejects.toThrow(AppErrors.STATUS_DEFAULT_DELETE);

      expect(statusRepository.delete).not.toHaveBeenCalled();
    });
  });
});
