import { Inject, Injectable } from '@nestjs/common';
import { IActivityRepository } from '../../domain/repositories/activity.repository.interface';

interface CreateActivityInput {
  action: string;
  leadId: string;
  userId: string;
}

@Injectable()
export class CreateActivityUseCase {
  constructor(
    @Inject('IActivityRepository')
    private readonly activityRepository: IActivityRepository,
  ) {}

  async execute(input: CreateActivityInput) {
    return this.activityRepository.create(input);
  }
}
