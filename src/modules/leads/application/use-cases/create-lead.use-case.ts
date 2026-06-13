import { Inject, Injectable } from '@nestjs/common';
import { ILeadRepository } from '../../domain/repositories/lead.repository.interface';
import { IStatusRepository } from '../../../statuses/domain/repositories/status.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';

interface CreateLeadInput {
  name: string;
  email?: string;
  phone?: string;
  type: string;
  propertyType: string;
  city?: string;
  neighborhood?: string;
  budgetMin?: number;
  budgetMax?: number;
  origin: string;
  notes?: string;
  userId: string;
}

@Injectable()
export class CreateLeadUseCase {
  constructor(
    @Inject('ILeadRepository')
    private readonly leadRepository: ILeadRepository,
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
  ) {}

  async execute(input: CreateLeadInput) {
    const defaultStatus = await this.statusRepository.findDefaultByUserId(
      input.userId,
    );

    if (!defaultStatus) {
      throw AppErrors.STATUS_NOT_FOUND;
    }

    return this.leadRepository.create({
      ...input,
      statusId: defaultStatus.id,
    });
  }
}
