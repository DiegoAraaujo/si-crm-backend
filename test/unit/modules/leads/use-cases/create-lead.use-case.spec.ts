import { CreateLeadUseCase } from 'src/modules/leads/application/use-cases/create-lead.use-case';
import { ILeadRepository } from 'src/modules/leads/domain/repositories/lead.repository.interface';
import { IStatusRepository } from 'src/modules/statuses/domain/repositories/status.repository.interface';
import { LeadEntity } from 'src/modules/leads/domain/entities/lead.entity';
import { StatusEntity } from 'src/modules/statuses/domain/entities/status.entity';
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

const makeDefaultStatus = (): StatusEntity =>
  new StatusEntity(
    'status-id-1',
    'New',
    '#3B82F6',
    0,
    true,
    'user-id-123',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );

const makeLeadRepository = (): jest.Mocked<ILeadRepository> => ({
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeStatusRepository = (): jest.Mocked<IStatusRepository> => ({
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  findDefaultByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('CreateLeadUseCase', () => {
  let useCase: CreateLeadUseCase;
  let leadRepository: jest.Mocked<ILeadRepository>;
  let statusRepository: jest.Mocked<IStatusRepository>;

  beforeEach(() => {
    leadRepository = makeLeadRepository();
    statusRepository = makeStatusRepository();
    useCase = new CreateLeadUseCase(leadRepository, statusRepository);
  });

  describe('when default status exists', () => {
    it('should create lead with the default status id', async () => {
      statusRepository.findDefaultByUserId.mockResolvedValue(
        makeDefaultStatus(),
      );
      leadRepository.create.mockResolvedValue(makeLead());

      await useCase.execute({
        name: 'John Doe',
        type: 'COMPRA',
        propertyType: 'APARTAMENTO',
        origin: 'WHATSAPP',
        userId: 'user-id-123',
      });

      expect(leadRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ statusId: 'status-id-1' }),
      );
    });

    it('should return the created lead', async () => {
      const lead = makeLead();
      statusRepository.findDefaultByUserId.mockResolvedValue(
        makeDefaultStatus(),
      );
      leadRepository.create.mockResolvedValue(lead);

      const result = await useCase.execute({
        name: 'John Doe',
        type: 'COMPRA',
        propertyType: 'APARTAMENTO',
        origin: 'WHATSAPP',
        userId: 'user-id-123',
      });

      expect(result).toEqual(lead);
    });
  });

  describe('when default status does not exist', () => {
    it('should throw STATUS_NOT_FOUND without creating lead', async () => {
      statusRepository.findDefaultByUserId.mockResolvedValue(null);

      await expect(
        useCase.execute({
          name: 'John Doe',
          type: 'COMPRA',
          propertyType: 'APARTAMENTO',
          origin: 'WHATSAPP',
          userId: 'user-id-123',
        }),
      ).rejects.toThrow(AppErrors.STATUS_NOT_FOUND);

      expect(leadRepository.create).not.toHaveBeenCalled();
    });
  });
});
