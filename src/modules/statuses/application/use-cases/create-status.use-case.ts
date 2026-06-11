import { Inject, Injectable } from '@nestjs/common';
import { IStatusRepository } from '../../domain/repositories/status.repository.interface';

interface CreateStatusInput {
  name: string;
  color: string;
  order: number;
  userId: string;
}

@Injectable()
export class CreateStatusUseCase {
  constructor(
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
  ) {}

  async execute(input: CreateStatusInput) {
    return this.statusRepository.create(input);
  }
}
