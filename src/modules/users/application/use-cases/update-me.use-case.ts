import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';

interface UpdateMeInput {
  userId: string;
  name: string;
}

export interface UpdateMeOutput {
  id: string;
  name: string;
  email: string;
  updatedAt: Date;
}

@Injectable()
export class UpdateMeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: UpdateMeInput): Promise<UpdateMeOutput> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw AppErrors.USER_NOT_FOUND;
    }

    const updated = await this.userRepository.update(input.userId, {
      name: input.name,
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      updatedAt: updated.updatedAt,
    };
  }
}
