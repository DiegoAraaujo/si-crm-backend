import { Inject, Injectable } from '@nestjs/common';
import { IStatusRepository } from '../../domain/repositories/status.repository.interface';

@Injectable()
export class ListStatusesUseCase {
  constructor(
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
  ) {}

  async execute(userId: string) {
    return this.statusRepository.findAllByUserId(userId);
  }
}
