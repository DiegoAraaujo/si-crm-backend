import { Inject, Injectable } from '@nestjs/common';
import { IKanbanRepository } from '../../domain/repositories/kanban.repository.interface';
import { IStatusRepository } from '../../../statuses/domain/repositories/status.repository.interface';
import { ILeadRepository } from '../../../leads/domain/repositories/lead.repository.interface';
import { CreateActivityUseCase } from '../../../activities/application/use-cases/create-activity.use-case';
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
    private readonly createActivityUseCase: CreateActivityUseCase,
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

    const updated = await this.kanbanRepository.moveLead(
      input.leadId,
      input.statusId,
    );

    await this.createActivityUseCase.execute({
      action: `Lead movido para ${status.name}`,
      leadId: input.leadId,
      userId: input.userId,
    });

    return updated;
  }
}
