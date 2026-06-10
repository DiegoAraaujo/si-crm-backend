import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';

export interface GetMeOutput {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<GetMeOutput> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw AppErrors.USER_NOT_FOUND;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
