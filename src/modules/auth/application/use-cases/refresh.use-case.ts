import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';
import { hashToken } from '../../../../shared/utils/hash.util';

interface RefreshOutput {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(token: string): Promise<RefreshOutput> {
    const tokenHash = hashToken(token);
    const refreshToken =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (
      !refreshToken ||
      refreshToken.revoked ||
      refreshToken.expiresAt < new Date()
    ) {
      throw AppErrors.REFRESH_TOKEN_INVALID;
    }

    const user = await this.userRepository.findById(refreshToken.userId);

    if (!user) {
      throw AppErrors.USER_NOT_FOUND;
    }

    await this.refreshTokenRepository.revokeByTokenHash(tokenHash);

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const newRefreshToken = crypto.randomUUID();
    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenRepository.create({
      tokenHash: newTokenHash,
      userId: user.id,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
