import { Inject, Injectable } from '@nestjs/common';
import { IActivityRepository } from '../../domain/repositories/activity.repository.interface';

interface ListActivitiesInput {
  userId: string;
  leadId?: string;
}

@Injectable()
export class ListActivitiesUseCase {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(input: ListActivitiesInput) {
    return this.activityRepository.findAll(input.userId, input.leadId);
  }
}
