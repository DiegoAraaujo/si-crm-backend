import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { IStatusRepository } from '../../../statuses/domain/repositories/status.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';
import { hashToken } from '../../../../shared/utils/hash.util';
import * as bcrypt from 'bcryptjs';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface RegisterOutput {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject('IStatusRepository')
    private readonly statusRepository: IStatusRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterInput): Promise<RegisterOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw AppErrors.USER_ALREADY_EXISTS;
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    await this.statusRepository.create({
      name: 'Novo',
      color: '#3B82F6',
      order: 0,
      userId: user.id,
      isDefault: true,
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = crypto.randomUUID();
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
