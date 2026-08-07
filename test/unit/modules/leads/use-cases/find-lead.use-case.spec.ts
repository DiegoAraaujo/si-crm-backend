import { FindLeadUseCase } from 'src/modules/leads/application/use-cases/find-lead.use-case';
import { ILeadRepository } from 'src/modules/leads/domain/repositories/lead.repository.interface';
import { LeadEntity } from 'src/modules/leads/domain/entities/lead.entity';
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

const makeLeadRepository = (): jest.Mocked<ILeadRepository> => ({
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('FindLeadUseCase', () => {
  let useCase: FindLeadUseCase;
  let leadRepository: jest.Mocked<ILeadRepository>;

  beforeEach(() => {
    leadRepository = makeLeadRepository();
    useCase = new FindLeadUseCase(leadRepository);
  });

  describe('when lead exists and belongs to user', () => {
    it('should return the lead', async () => {
      const lead = makeLead();
      leadRepository.findById.mockResolvedValue(lead);

      const result = await useCase.execute({
        id: 'lead-id-1',
        userId: 'user-id-123',
      });

      expect(result).toEqual(lead);
    });

    it('should call repository with correct id', async () => {
      leadRepository.findById.mockResolvedValue(makeLead());

      await useCase.execute({ id: 'lead-id-1', userId: 'user-id-123' });

      expect(leadRepository.findById).toHaveBeenCalledWith('lead-id-1');
    });
  });

  describe('when lead does not exist', () => {
    it('should throw LEAD_NOT_FOUND', async () => {
      leadRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ id: 'unknown-id', userId: 'user-id-123' }),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);
    });
  });

  describe('when lead belongs to another user', () => {
    it('should throw LEAD_NOT_FOUND', async () => {
      leadRepository.findById.mockResolvedValue(
        makeLead({ userId: 'another-user-id' }),
      );

      await expect(
        useCase.execute({ id: 'lead-id-1', userId: 'user-id-123' }),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);
    });
  });
});
