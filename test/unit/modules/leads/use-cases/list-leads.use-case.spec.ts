import { ListLeadsUseCase } from 'src/modules/leads/application/use-cases/list-leads.use-case';
import { ILeadRepository } from 'src/modules/leads/domain/repositories/lead.repository.interface';
import { LeadEntity } from 'src/modules/leads/domain/entities/lead.entity';

const makeLead = (overrides?: Partial<LeadEntity>): LeadEntity =>
  new LeadEntity(
    overrides?.id ?? 'lead-id-1',
    overrides?.name ?? 'John Doe',
    overrides?.email ?? null,
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

const makeLeadRepository = (): jest.Mocked<ILeadRepository> => ({
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ListLeadsUseCase', () => {
  let useCase: ListLeadsUseCase;
  let leadRepository: jest.Mocked<ILeadRepository>;

  beforeEach(() => {
    leadRepository = makeLeadRepository();
    useCase = new ListLeadsUseCase(leadRepository);
  });

  it('should return all leads for the user', async () => {
    const leads = [makeLead(), makeLead({ id: 'lead-id-2' })];
    leadRepository.findAllByUserId.mockResolvedValue(leads);

    const result = await useCase.execute({ userId: 'user-id-123' });

    expect(result).toEqual(leads);
    expect(leadRepository.findAllByUserId).toHaveBeenCalledWith('user-id-123', {
      statusId: undefined,
      origin: undefined,
      search: undefined,
    });
  });

  it('should pass statusId filter to repository', async () => {
    leadRepository.findAllByUserId.mockResolvedValue([]);

    await useCase.execute({ userId: 'user-id-123', statusId: 'status-id-1' });

    expect(leadRepository.findAllByUserId).toHaveBeenCalledWith('user-id-123', {
      statusId: 'status-id-1',
      origin: undefined,
      search: undefined,
    });
  });

  it('should pass origin filter to repository', async () => {
    leadRepository.findAllByUserId.mockResolvedValue([]);

    await useCase.execute({ userId: 'user-id-123', origin: 'WHATSAPP' });

    expect(leadRepository.findAllByUserId).toHaveBeenCalledWith('user-id-123', {
      statusId: undefined,
      origin: 'WHATSAPP',
      search: undefined,
    });
  });

  it('should pass search filter to repository', async () => {
    leadRepository.findAllByUserId.mockResolvedValue([]);

    await useCase.execute({ userId: 'user-id-123', search: 'John' });

    expect(leadRepository.findAllByUserId).toHaveBeenCalledWith('user-id-123', {
      statusId: undefined,
      origin: undefined,
      search: 'John',
    });
  });

  it('should return empty array when user has no leads', async () => {
    leadRepository.findAllByUserId.mockResolvedValue([]);

    const result = await useCase.execute({ userId: 'user-id-123' });

    expect(result).toEqual([]);
  });
});
