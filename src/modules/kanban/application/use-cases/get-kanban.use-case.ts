import { Inject, Injectable } from '@nestjs/common';
import { IKanbanRepository } from '../../domain/repositories/kanban.repository.interface';

@Injectable()
export class GetKanbanUseCase {
  constructor(
    @Inject('IKanbanRepository')
    private readonly kanbanRepository: IKanbanRepository,
  ) {}

  async execute(userId: string) {
    return this.kanbanRepository.findAllByUserId(userId);
  }
}
