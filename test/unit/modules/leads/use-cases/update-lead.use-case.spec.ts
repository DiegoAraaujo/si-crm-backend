import { UpdateLeadUseCase } from 'src/modules/leads/application/use-cases/update-lead.use-case';
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

describe('UpdateLeadUseCase', () => {
  let useCase: UpdateLeadUseCase;
  let leadRepository: jest.Mocked<ILeadRepository>;

  beforeEach(() => {
    leadRepository = makeLeadRepository();
    useCase = new UpdateLeadUseCase(leadRepository);
  });

  describe('when lead exists and belongs to user', () => {
    it('should update and return the lead', async () => {
      const updated = makeLead({ name: 'John Updated' });
      leadRepository.findById.mockResolvedValue(makeLead());
      leadRepository.update.mockResolvedValue(updated);

      const result = await useCase.execute({
        id: 'lead-id-1',
        userId: 'user-id-123',
        name: 'John Updated',
      });

      expect(result).toEqual(updated);
    });

    it('should call update without id and userId in the data', async () => {
      leadRepository.findById.mockResolvedValue(makeLead());
      leadRepository.update.mockResolvedValue(makeLead());

      await useCase.execute({
        id: 'lead-id-1',
        userId: 'user-id-123',
        name: 'John Updated',
        city: 'Fortaleza',
      });

      const updateCall = leadRepository.update.mock.calls[0];
      expect(updateCall[0]).toBe('lead-id-1');
      expect(updateCall[1]).not.toHaveProperty('id');
      expect(updateCall[1]).not.toHaveProperty('userId');
      expect(updateCall[1]).toMatchObject({
        name: 'John Updated',
        city: 'Fortaleza',
      });
    });
  });

  describe('when lead does not exist', () => {
    it('should throw LEAD_NOT_FOUND without calling update', async () => {
      leadRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ id: 'unknown-id', userId: 'user-id-123', name: 'X' }),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);

      expect(leadRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('when lead belongs to another user', () => {
    it('should throw LEAD_NOT_FOUND without calling update', async () => {
      leadRepository.findById.mockResolvedValue(
        makeLead({ userId: 'another-user-id' }),
      );

      await expect(
        useCase.execute({ id: 'lead-id-1', userId: 'user-id-123', name: 'X' }),
      ).rejects.toThrow(AppErrors.LEAD_NOT_FOUND);

      expect(leadRepository.update).not.toHaveBeenCalled();
    });
  });
});
