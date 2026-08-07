import { GetKanbanUseCase } from 'src/modules/kanban/application/use-cases/get-kanban.use-case';
import { IKanbanRepository } from 'src/modules/kanban/domain/repositories/kanban.repository.interface';
import { LeadEntity } from 'src/modules/leads/domain/entities/lead.entity';

const makeLead = (overrides?: Partial<LeadEntity>): LeadEntity =>
  new LeadEntity(
    overrides?.id ?? 'lead-id-1',
    overrides?.name ?? 'John Doe',
    overrides?.email ?? 'john@example.com',
    overrides?.phone ?? null,
    overrides?.type ?? 'COMPRA',
    overrides?.propertyType ?? 'APARTAMENTO',
    overrides?.city ?? 'Fortaleza',
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

const makeKanbanRepository = (): jest.Mocked<IKanbanRepository> => ({
  findAllByUserId: jest.fn(),
  moveLead: jest.fn(),
});

describe('GetKanbanUseCase', () => {
  let useCase: GetKanbanUseCase;
  let kanbanRepository: jest.Mocked<IKanbanRepository>;

  beforeEach(() => {
    kanbanRepository = makeKanbanRepository();
    useCase = new GetKanbanUseCase(kanbanRepository);
  });

  it('should return kanban columns with leads for the user', async () => {
    const columns = [
      {
        id: 'status-id-1',
        name: 'New',
        color: '#3B82F6',
        order: 0,
        leads: [makeLead()],
      },
      {
        id: 'status-id-2',
        name: 'In Progress',
        color: '#10B981',
        order: 1,
        leads: [],
      },
    ];
    kanbanRepository.findAllByUserId.mockResolvedValue(columns);

    const result = await useCase.execute('user-id-123');

    expect(result).toEqual(columns);
    expect(kanbanRepository.findAllByUserId).toHaveBeenCalledWith(
      'user-id-123',
    );
  });

  it('should return empty array when user has no statuses', async () => {
    kanbanRepository.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute('user-id-123');

    expect(result).toEqual([]);
  });
});
