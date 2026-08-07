import { Test, TestingModule } from '@nestjs/testing';
import { LeadsController } from 'src/modules/leads/presentation/leads.controller';
import { CreateLeadUseCase } from 'src/modules/leads/application/use-cases/create-lead.use-case';
import { ListLeadsUseCase } from 'src/modules/leads/application/use-cases/list-leads.use-case';
import { FindLeadUseCase } from 'src/modules/leads/application/use-cases/find-lead.use-case';
import { UpdateLeadUseCase } from 'src/modules/leads/application/use-cases/update-lead.use-case';
import { DeleteLeadUseCase } from 'src/modules/leads/application/use-cases/delete-lead.use-case';
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
    'status-id-1',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );

describe('LeadsController', () => {
  let controller: LeadsController;
  let createLeadUseCase: jest.Mocked<CreateLeadUseCase>;
  let listLeadsUseCase: jest.Mocked<ListLeadsUseCase>;
  let findLeadUseCase: jest.Mocked<FindLeadUseCase>;
  let updateLeadUseCase: jest.Mocked<UpdateLeadUseCase>;
  let deleteLeadUseCase: jest.Mocked<DeleteLeadUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeadsController],
      providers: [
        { provide: CreateLeadUseCase, useValue: { execute: jest.fn() } },
        { provide: ListLeadsUseCase, useValue: { execute: jest.fn() } },
        { provide: FindLeadUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateLeadUseCase, useValue: { execute: jest.fn() } },
        { provide: DeleteLeadUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get<LeadsController>(LeadsController);
    createLeadUseCase = module.get(CreateLeadUseCase);
    listLeadsUseCase = module.get(ListLeadsUseCase);
    findLeadUseCase = module.get(FindLeadUseCase);
    updateLeadUseCase = module.get(UpdateLeadUseCase);
    deleteLeadUseCase = module.get(DeleteLeadUseCase);
  });

  describe('GET /leads', () => {
    it('should call ListLeadsUseCase with userId and no filters', async () => {
      listLeadsUseCase.execute.mockResolvedValue([]);

      await controller.list(makeRequest() as Request);

      expect(listLeadsUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id-123',
        statusId: undefined,
        origin: undefined,
        search: undefined,
      });
    });

    it('should pass query filters to ListLeadsUseCase', async () => {
      listLeadsUseCase.execute.mockResolvedValue([]);

      await controller.list(
        makeRequest() as Request,
        'status-id-1',
        'WHATSAPP',
        'John',
      );

      expect(listLeadsUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id-123',
        statusId: 'status-id-1',
        origin: 'WHATSAPP',
        search: 'John',
      });
    });
  });

  describe('POST /leads', () => {
    it('should call CreateLeadUseCase with correct data', async () => {
      createLeadUseCase.execute.mockResolvedValue(makeLead());

      await controller.create(makeRequest() as Request, {
        name: 'John Doe',
        type: 'COMPRA' as any,
        propertyType: 'APARTAMENTO' as any,
        origin: 'WHATSAPP' as any,
      });

      expect(createLeadUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-id-123', name: 'John Doe' }),
      );
    });
  });

  describe('GET /leads/:id', () => {
    it('should call FindLeadUseCase with correct id and userId', async () => {
      findLeadUseCase.execute.mockResolvedValue(makeLead());

      await controller.findOne(makeRequest() as Request, 'lead-id-1');

      expect(findLeadUseCase.execute).toHaveBeenCalledWith({
        id: 'lead-id-1',
        userId: 'user-id-123',
      });
    });

    it('should propagate error if FindLeadUseCase throws', async () => {
      findLeadUseCase.execute.mockRejectedValue(AppErrors.LEAD_NOT_FOUND);

      await expect(
        controller.findOne(makeRequest() as Request, 'unknown-id'),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);
    });
  });

  describe('PATCH /leads/:id', () => {
    it('should call UpdateLeadUseCase with correct data', async () => {
      updateLeadUseCase.execute.mockResolvedValue(makeLead());

      await controller.update(makeRequest() as Request, 'lead-id-1', {
        name: 'John Updated',
      });

      expect(updateLeadUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'lead-id-1',
          userId: 'user-id-123',
          name: 'John Updated',
        }),
      );
    });
  });

  describe('DELETE /leads/:id', () => {
    it('should call DeleteLeadUseCase with correct data', async () => {
      deleteLeadUseCase.execute.mockResolvedValue(undefined);

      await controller.delete(makeRequest() as Request, 'lead-id-1');

      expect(deleteLeadUseCase.execute).toHaveBeenCalledWith({
        id: 'lead-id-1',
        userId: 'user-id-123',
      });
    });

    it('should propagate error if DeleteLeadUseCase throws', async () => {
      deleteLeadUseCase.execute.mockRejectedValue(AppErrors.LEAD_NOT_FOUND);

      await expect(
        controller.delete(makeRequest() as Request, 'unknown-id'),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);
    });
  });
});
