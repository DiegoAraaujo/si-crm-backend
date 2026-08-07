import { MoveLeadUseCase } from 'src/modules/kanban/application/use-cases/move-lead.use-case';
import { IKanbanRepository } from 'src/modules/kanban/domain/repositories/kanban.repository.interface';
import { IStatusRepository } from 'src/modules/statuses/domain/repositories/status.repository.interface';
import { ILeadRepository } from 'src/modules/leads/domain/repositories/lead.repository.interface';
import { CreateActivityUseCase } from 'src/modules/activities/application/use-cases/create-activity.use-case';
import { LeadEntity } from 'src/modules/leads/domain/entities/lead.entity';
import { StatusEntity } from 'src/modules/statuses/domain/entities/status.entity';
import { ActivityEntity } from 'src/modules/activities/domain/entities/activity.entity';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';

const makeLead = (overrides?: Partial<LeadEntity>): LeadEntity =>
  new LeadEntity(
    overrides?.id ?? 'lead-id-1',
    overrides?.name ?? 'John Doe',
    overrides?.email ?? null,
    overrides?.phone ?? null,
    overrides?.type ?? 'COMPRA',
    overrides?.propertyType ?? 'APARTAMENTO',
    overrides?.city ?? null,
    overrides?.neighborhood ?? null,
    overrides?.budgetMin ?? null,
    overrides?.budgetMax ?? null,
    overrides?.origin ?? 'WHATSAPP',
    overrides?.notes ?? null,
    overrides?.userId ?? 'user-id-123',
    overrides?.statusId ?? 'status-id-1',
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.updatedAt ?? new Date('2024-01-01'),
  );

const makeStatus = (overrides?: Partial<StatusEntity>): StatusEntity =>
  new StatusEntity(
    overrides?.id ?? 'status-id-2',
    overrides?.name ?? 'In Progress',
    overrides?.color ?? '#10B981',
    overrides?.order ?? 1,
    overrides?.isDefault ?? false,
    overrides?.userId ?? 'user-id-123',
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.updatedAt ?? new Date('2024-01-01'),
  );

const makeKanbanRepository = (): jest.Mocked<IKanbanRepository> => ({
  findAllByUserId: jest.fn(),
  moveLead: jest.fn(),
});

const makeStatusRepository = (): jest.Mocked<IStatusRepository> => ({
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  findDefaultByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeLeadRepository = (): jest.Mocked<ILeadRepository> => ({
  findById: jest.fn(),
  findAllByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeCreateActivityUseCase = (): jest.Mocked<CreateActivityUseCase> =>
  ({ execute: jest.fn().mockResolvedValue({} as ActivityEntity) }) as any;

describe('MoveLeadUseCase', () => {
  let useCase: MoveLeadUseCase;
  let kanbanRepository: jest.Mocked<IKanbanRepository>;
  let statusRepository: jest.Mocked<IStatusRepository>;
  let leadRepository: jest.Mocked<ILeadRepository>;
  let createActivityUseCase: jest.Mocked<CreateActivityUseCase>;

  beforeEach(() => {
    kanbanRepository = makeKanbanRepository();
    statusRepository = makeStatusRepository();
    leadRepository = makeLeadRepository();
    createActivityUseCase = makeCreateActivityUseCase();

    useCase = new MoveLeadUseCase(
      kanbanRepository,
      statusRepository,
      leadRepository,
      createActivityUseCase,
    );
  });

  describe('when lead and status exist and belong to user', () => {
    beforeEach(() => {
      leadRepository.findById.mockResolvedValue(makeLead());
      statusRepository.findById.mockResolvedValue(makeStatus());
      kanbanRepository.moveLead.mockResolvedValue(
        makeLead({ statusId: 'status-id-2' }),
      );
    });

    it('should move the lead to the new status', async () => {
      const result = await useCase.execute({
        leadId: 'lead-id-1',
        statusId: 'status-id-2',
        userId: 'user-id-123',
      });

      expect(kanbanRepository.moveLead).toHaveBeenCalledWith(
        'lead-id-1',
        'status-id-2',
      );
      expect(result.statusId).toBe('status-id-2');
    });

    it('should create an activity after moving the lead', async () => {
      await useCase.execute({
        leadId: 'lead-id-1',
        statusId: 'status-id-2',
        userId: 'user-id-123',
      });

      expect(createActivityUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          leadId: 'lead-id-1',
          userId: 'user-id-123',
        }),
      );
    });

    it('should create activity after moving, not before', async () => {
      await useCase.execute({
        leadId: 'lead-id-1',
        statusId: 'status-id-2',
        userId: 'user-id-123',
      });

      const moveOrder = kanbanRepository.moveLead.mock.invocationCallOrder[0];
      const activityOrder =
        createActivityUseCase.execute.mock.invocationCallOrder[0];
      expect(moveOrder).toBeLessThan(activityOrder);
    });
  });

  describe('when lead does not exist', () => {
    it('should throw LEAD_NOT_FOUND without moving', async () => {
      leadRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({
          leadId: 'unknown-id',
          statusId: 'status-id-2',
          userId: 'user-id-123',
        }),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);

      expect(kanbanRepository.moveLead).not.toHaveBeenCalled();
    });
  });

  describe('when lead belongs to another user', () => {
    it('should throw LEAD_NOT_FOUND', async () => {
      leadRepository.findById.mockResolvedValue(
        makeLead({ userId: 'another-user-id' }),
      );

      await expect(
        useCase.execute({
          leadId: 'lead-id-1',
          statusId: 'status-id-2',
          userId: 'user-id-123',
        }),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);

      expect(kanbanRepository.moveLead).not.toHaveBeenCalled();
    });
  });

  describe('when status does not exist', () => {
    it('should throw STATUS_NOT_FOUND without moving', async () => {
      leadRepository.findById.mockResolvedValue(makeLead());
      statusRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({
          leadId: 'lead-id-1',
          statusId: 'unknown-id',
          userId: 'user-id-123',
        }),
      ).rejects.toThrow(AppErrors.STATUS_NOT_FOUND);

      expect(kanbanRepository.moveLead).not.toHaveBeenCalled();
    });
  });

  describe('when status belongs to another user', () => {
    it('should throw STATUS_NOT_FOUND', async () => {
      leadRepository.findById.mockResolvedValue(makeLead());
      statusRepository.findById.mockResolvedValue(
        makeStatus({ userId: 'another-user-id' }),
      );

      await expect(
        useCase.execute({
          leadId: 'lead-id-1',
          statusId: 'status-id-2',
          userId: 'user-id-123',
        }),
      ).rejects.toThrow(AppErrors.STATUS_NOT_FOUND);

      expect(kanbanRepository.moveLead).not.toHaveBeenCalled();
    });
  });
});
