import { Inject, Injectable } from '@nestjs/common';
import { ILeadRepository } from '../../domain/repositories/lead.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';

interface UpdateLeadInput {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  propertyType?: string;
  city?: string;
  neighborhood?: string;
  budgetMin?: number;
  budgetMax?: number;
  origin?: string;
  notes?: string;
  statusId?: string;
}

@Injectable()
export class UpdateLeadUseCase {
  constructor(
    @Inject('ILeadRepository')
    private readonly leadRepository: ILeadRepository,
  ) {}

  async execute(input: UpdateLeadInput) {
    const lead = await this.leadRepository.findById(input.id);

    if (!lead || lead.userId !== input.userId) {
      throw AppErrors.LEAD_NOT_FOUND;
    }

    const { id, userId, ...data } = input;

    return this.leadRepository.update(id, data);
  }
}
