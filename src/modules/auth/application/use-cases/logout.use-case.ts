import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { AppErrors } from '../../../../shared/domain/errors/error-dictionary';
import { hashToken } from '../../../../shared/utils/hash.util';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async execute(token: string): Promise<void> {
    const tokenHash = hashToken(token);
    const refreshToken =
      await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!refreshToken || refreshToken.revoked) {
      throw AppErrors.REFRESH_TOKEN_INVALID;
    }

    await this.refreshTokenRepository.revokeByTokenHash(tokenHash);
  }
}
