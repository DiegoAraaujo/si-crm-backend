import { Inject, Injectable } from '@nestjs/common';
import { IStatusRepository } from '../../domain/repositories/status.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';

interface UpdateStatusInput {
  id: string;
  userId: string;
  name?: string;
  color?: string;
  order?: number;
}

@Injectable()
export class UpdateStatusUseCase {
  constructor(
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
  ) {}

  async execute(input: UpdateStatusInput) {
    const status = await this.statusRepository.findById(input.id);

    if (!status || status.userId !== input.userId) {
      throw AppErrors.STATUS_NOT_FOUND;
    }

    return this.statusRepository.update(input.id, {
      name: input.name,
      color: input.color,
      order: input.order,
    });
  }
}
