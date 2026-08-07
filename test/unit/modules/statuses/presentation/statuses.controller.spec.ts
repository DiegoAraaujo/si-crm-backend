import { Test, TestingModule } from '@nestjs/testing';
import { StatusesController } from 'src/modules/statuses/presentation/statuses.controller';
import { ListStatusesUseCase } from 'src/modules/statuses/application/use-cases/list-statuses.use-case';
import { CreateStatusUseCase } from 'src/modules/statuses/application/use-cases/create-status.use-case';
import { UpdateStatusUseCase } from 'src/modules/statuses/application/use-cases/update-status.use-case';
import { DeleteStatusUseCase } from 'src/modules/statuses/application/use-cases/delete-status.use-case';
import { StatusEntity } from 'src/modules/statuses/domain/entities/status.entity';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';
import { Request } from 'express';

const makeRequest = (userId = 'user-id-123'): Partial<Request> => ({
  user: { id: userId },
});

const makeStatus = (): StatusEntity =>
  new StatusEntity(
    'status-id-1',
    'New',
    '#3B82F6',
    0,
    false,
    'user-id-123',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );

describe('StatusesController', () => {
  let controller: StatusesController;
  let listStatusesUseCase: jest.Mocked<ListStatusesUseCase>;
  let createStatusUseCase: jest.Mocked<CreateStatusUseCase>;
  let updateStatusUseCase: jest.Mocked<UpdateStatusUseCase>;
  let deleteStatusUseCase: jest.Mocked<DeleteStatusUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusesController],
      providers: [
        { provide: ListStatusesUseCase, useValue: { execute: jest.fn() } },
        { provide: CreateStatusUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateStatusUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteStatusUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<StatusesController>(StatusesController);
    listStatusesUseCase = module.get(ListStatusesUseCase);
    createStatusUseCase = module.get(CreateStatusUseCase);
    updateStatusUseCase = module.get(UpdateStatusUseCase);
    deleteStatusUseCase = module.get(DeleteStatusUseCase);
  });

  describe('GET /statuses', () => {
    it('should call ListStatusesUseCase with the authenticated user id', async () => {
      listStatusesUseCase.execute.mockResolvedValue([]);

      await controller.list(makeRequest() as Request);

      expect(listStatusesUseCase.execute).toHaveBeenCalledWith('user-id-123');
    });

    it('should return the output from ListStatusesUseCase', async () => {
      const statuses = [makeStatus()];
      listStatusesUseCase.execute.mockResolvedValue(statuses);

      const result = await controller.list(makeRequest() as Request);

      expect(result).toEqual(statuses);
    });
  });

  describe('POST /statuses', () => {
    it('should call CreateStatusUseCase with correct data', async () => {
      createStatusUseCase.execute.mockResolvedValue(makeStatus());

      await controller.create(makeRequest() as Request, {
        name: 'New',
        color: '#3B82F6',
        order: 0,
      });

      expect(createStatusUseCase.execute).toHaveBeenCalledWith({
        name: 'New',
        color: '#3B82F6',
        order: 0,
        userId: 'user-id-123',
      });
    });
  });

  describe('PATCH /statuses/:id', () => {
    it('should call UpdateStatusUseCase with correct data', async () => {
      updateStatusUseCase.execute.mockResolvedValue(makeStatus());

      await controller.update(makeRequest() as Request, 'status-id-1', {
        name: 'In Progress',
      });

      expect(updateStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'status-id-1',
        userId: 'user-id-123',
        name: 'In Progress',
      });
    });

    it('should propagate error if UpdateStatusUseCase throws', async () => {
      updateStatusUseCase.execute.mockRejectedValue(AppErrors.STATUS_NOT_FOUND);

      await expect(
        controller.update(makeRequest() as Request, 'unknown-id', {
          name: 'X',
        }),
      ).rejects.toThrow(AppErrors.STATUS_NOT_FOUND);
    });
  });

  describe('DELETE /statuses/:id', () => {
    it('should call DeleteStatusUseCase with correct data', async () => {
      deleteStatusUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(makeRequest() as Request, 'status-id-1');

      expect(deleteStatusUseCase.execute).toHaveBeenCalledWith({
        id: 'status-id-1',
        userId: 'user-id-123',
      });
    });

    it('should propagate error if DeleteStatusUseCase throws', async () => {
      deleteStatusUseCase.execute.mockRejectedValue(
        AppErrors.STATUS_DEFAULT_DELETE,
      );

      await expect(
        controller.delete(makeRequest() as Request, 'status-id-1'),
      ).rejects.toThrow(AppErrors.STATUS_DEFAULT_DELETE);
    });
  });
});
