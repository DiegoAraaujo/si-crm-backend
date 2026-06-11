import { Inject, Injectable } from '@nestjs/common';
import { IStatusRepository } from '../../domain/repositories/status.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';

interface DeleteStatusInput {
  id: string;
  userId: string;
}

@Injectable()
export class DeleteStatusUseCase {
  constructor(
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
  ) {}

  async execute(input: DeleteStatusInput): Promise<void> {
    const status = await this.statusRepository.findById(input.id);

    if (!status || status.userId !== input.userId) {
      throw AppErrors.STATUS_NOT_FOUND;
    }

    if (status.isDefault) {
      throw AppErrors.STATUS_DEFAULT_DELETE;
    }

    await this.statusRepository.delete(input.id);
  }
}
