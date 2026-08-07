import { LogoutUseCase } from 'src/modules/auth/application/use-cases/logout.use-case';
import { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository.interface';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';
import { RefreshTokenEntity } from 'src/modules/auth/domain/entities/refresh-token.entity';

const makeRefreshToken = (
  overrides?: Partial<RefreshTokenEntity>,
): RefreshTokenEntity =>
  new RefreshTokenEntity(
    overrides?.id ?? 'token-id',
    overrides?.tokenHash ?? 'token-hash',
    overrides?.userId ?? 'user-id-123',
    overrides?.expiresAt ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    overrides?.revoked ?? false,
    overrides?.createdAt ?? new Date(),
  );

const makeRefreshTokenRepository =
  (): jest.Mocked<IRefreshTokenRepository> => ({
    create: jest.fn(),
    findByTokenHash: jest.fn(),
    revokeByTokenHash: jest.fn(),
    revokeAllByUserId: jest.fn(),
  });

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;

  beforeEach(() => {
    refreshTokenRepository = makeRefreshTokenRepository();
    useCase = new LogoutUseCase(refreshTokenRepository);
  });

  describe('when token is valid', () => {
    it('should revoke the token', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        makeRefreshToken(),
      );

      await useCase.execute('valid-raw-token');

      expect(refreshTokenRepository.revokeByTokenHash).toHaveBeenCalledTimes(1);
    });

    it('should return void', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        makeRefreshToken(),
      );

      const result = await useCase.execute('valid-raw-token');

      expect(result).toBeUndefined();
    });
  });

  describe('when token does not exist', () => {
    it('should throw REFRESH_TOKEN_INVALID', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(null);

      await expect(useCase.execute('unknown-token')).rejects.toThrow(
        AppErrors.REFRESH_TOKEN_INVALID,
      );
    });

    it('should not call revokeByTokenHash', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(null);

      await expect(useCase.execute('unknown-token')).rejects.toThrow();

      expect(refreshTokenRepository.revokeByTokenHash).not.toHaveBeenCalled();
    });
  });

  describe('when token is already revoked', () => {
    it('should throw REFRESH_TOKEN_INVALID', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        makeRefreshToken({ revoked: true }),
      );

      await expect(useCase.execute('revoked-token')).rejects.toThrow(
        AppErrors.REFRESH_TOKEN_INVALID,
      );
    });
  });
});
