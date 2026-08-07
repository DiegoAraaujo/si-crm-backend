import { Test, TestingModule } from '@nestjs/testing';
import { KanbanController } from 'src/modules/kanban/presentation/kanban.controller';
import { GetKanbanUseCase } from 'src/modules/kanban/application/use-cases/get-kanban.use-case';
import { MoveLeadUseCase } from 'src/modules/kanban/application/use-cases/move-lead.use-case';
import { LeadEntity } from 'src/modules/leads/domain/entities/lead.entity';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';
import { Request } from 'express';

const makeRequest = (userId = 'user-id-123'): Partial<Request> => ({
  user: { id: userId },
});

const makeLead = (): LeadEntity =>
  new LeadEntity(
    'lead-id-1',
    'John Doe',
    null,
    null,
    'COMPRA',
    'APARTAMENTO',
    null,
    null,
    null,
    null,
    'WHATSAPP',
    null,
    'user-id-123',
    'status-id-2',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );

describe('KanbanController', () => {
  let controller: KanbanController;
  let getKanbanUseCase: jest.Mocked<GetKanbanUseCase>;
  let moveLeadUseCase: jest.Mocked<MoveLeadUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KanbanController],
      providers: [
        { provide: GetKanbanUseCase, useValue: { execute: jest.fn() } },
        { provide: MoveLeadUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<KanbanController>(KanbanController);
    getKanbanUseCase = module.get(GetKanbanUseCase);
    moveLeadUseCase = module.get(MoveLeadUseCase);
  });

  describe('GET /kanban', () => {
    it('should call GetKanbanUseCase with the authenticated user id', async () => {
      getKanbanUseCase.execute.mockResolvedValue([]);

      await controller.getKanban(makeRequest() as Request);

      expect(getKanbanUseCase.execute).toHaveBeenCalledWith('user-id-123');
    });

    it('should return the output from GetKanbanUseCase', async () => {
      const columns = [
        { id: 'status-id-1', name: 'New', color: '#blue', order: 0, leads: [] },
      ];
      getKanbanUseCase.execute.mockResolvedValue(columns);

      const result = await controller.getKanban(makeRequest() as Request);

      expect(result).toEqual(columns);
    });
  });

  describe('PATCH /kanban/:leadId/move', () => {
    it('should call MoveLeadUseCase with correct data', async () => {
      moveLeadUseCase.execute.mockResolvedValue(makeLead());

      await controller.moveLead(makeRequest() as Request, 'lead-id-1', {
        statusId: 'status-id-2',
      });

      expect(moveLeadUseCase.execute).toHaveBeenCalledWith({
        leadId: 'lead-id-1',
        statusId: 'status-id-2',
        userId: 'user-id-123',
      });
    });

    it('should return the updated lead', async () => {
      const lead = makeLead();
      moveLeadUseCase.execute.mockResolvedValue(lead);

      const result = await controller.moveLead(
        makeRequest() as Request,
        'lead-id-1',
        {
          statusId: 'status-id-2',
        },
      );

      expect(result).toEqual(lead);
    });

    it('should propagate error if MoveLeadUseCase throws', async () => {
      moveLeadUseCase.execute.mockRejectedValue(AppErrors.LEAD_NOT_FOUND);

      await expect(
        controller.moveLead(makeRequest() as Request, 'unknown-id', {
          statusId: 'status-id-2',
        }),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);
    });
  });
});
