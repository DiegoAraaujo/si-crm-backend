import { Inject, Injectable } from '@nestjs/common';
import { ILeadRepository } from '../../domain/repositories/lead.repository.interface';

interface ListLeadsInput {
  userId: string;
  statusId?: string;
  origin?: string;
  search?: string;
}

@Injectable()
export class ListLeadsUseCase {
  constructor(
    @Inject('ILeadRepository')
    private readonly leadRepository: ILeadRepository,
  ) {}

  async execute(input: ListLeadsInput) {
    return this.leadRepository.findAllByUserId(input.userId, {
      statusId: input.statusId,
      origin: input.origin,
      search: input.search,
    });
  }
}
