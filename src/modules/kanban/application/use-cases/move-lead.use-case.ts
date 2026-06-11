import { Inject, Injectable } from '@nestjs/common';
import { IKanbanRepository } from '../../domain/repositories/kanban.repository.interface';
import { IStatusRepository } from '../../../statuses/domain/repositories/status.repository.interface';
import { ILeadRepository } from '../../../leads/domain/repositories/lead.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';

interface MoveLeadInput {
  leadId: string;
  statusId: string;
  userId: string;
}

@Injectable()
export class MoveLeadUseCase {
  constructor(
    @Inject('IKanbanRepository')
    private readonly kanbanRepository: IKanbanRepository,
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
    @Inject('ILeadRepository')
    private readonly leadRepository: ILeadRepository,
  ) {}

  async execute(input: MoveLeadInput) {
    const lead = await this.leadRepository.findById(input.leadId);

    if (!lead || lead.userId !== input.userId) {
      throw AppErrors.LEAD_NOT_FOUND;
    }

    const status = await this.statusRepository.findById(input.statusId);

    if (!status || status.userId !== input.userId) {
      throw AppErrors.STATUS_NOT_FOUND;
    }

    return this.kanbanRepository.moveLead(input.leadId, input.statusId);
  }
}
