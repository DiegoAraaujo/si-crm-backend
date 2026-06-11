import { Inject, Injectable } from '@nestjs/common';
import { ILeadRepository } from '../../domain/repositories/lead.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';

interface DeleteLeadInput {
  id: string;
  userId: string;
}

@Injectable()
export class DeleteLeadUseCase {
  constructor(
    @Inject('ILeadRepository')
    private readonly leadRepository: ILeadRepository,
  ) {}

  async execute(input: DeleteLeadInput): Promise<void> {
    const lead = await this.leadRepository.findById(input.id);

    if (!lead || lead.userId !== input.userId) {
      throw AppErrors.LEAD_NOT_FOUND;
    }

    await this.leadRepository.delete(input.id);
  }
}
