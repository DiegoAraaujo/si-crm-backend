import { RefreshUseCase } from 'src/modules/auth/application/use-cases/refresh.use-case';
import { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository.interface';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';
import { RefreshTokenEntity } from 'src/modules/auth/domain/entities/refresh-token.entity';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

const makeUser = (): UserEntity =>
  new UserEntity(
    'user-id-123',
    'John Doe',
    'john@example.com',
    'hashed-password',
    new Date('2024-01-01'),
    new Date('2024-01-01'),
  );

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

const makeUserRepository = (): jest.Mocked<IUserRepository> => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

const makeJwtService = (): jest.Mocked<JwtService> =>
  ({ sign: jest.fn().mockReturnValue('new-access-token') }) as any;

describe('RefreshUseCase', () => {
  let useCase: RefreshUseCase;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;
  let userRepository: jest.Mocked<IUserRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    refreshTokenRepository = makeRefreshTokenRepository();
    userRepository = makeUserRepository();
    jwtService = makeJwtService();

    useCase = new RefreshUseCase(
      refreshTokenRepository,
      userRepository,
      jwtService,
    );
  });

  describe('when token is valid', () => {
    beforeEach(() => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        makeRefreshToken(),
      );
      refreshTokenRepository.create.mockResolvedValue(makeRefreshToken());
      userRepository.findById.mockResolvedValue(makeUser());
    });

    it('should return new accessToken and refreshToken', async () => {
      const result = await useCase.execute('valid-raw-token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should revoke the old token before issuing a new one', async () => {
      await useCase.execute('valid-raw-token');

      expect(refreshTokenRepository.revokeByTokenHash).toHaveBeenCalledTimes(1);
      expect(refreshTokenRepository.create).toHaveBeenCalledTimes(1);

      const revokeOrder =
        refreshTokenRepository.revokeByTokenHash.mock.invocationCallOrder[0];
      const createOrder =
        refreshTokenRepository.create.mock.invocationCallOrder[0];
      expect(revokeOrder).toBeLessThan(createOrder);
    });
  });

  describe('when token is revoked', () => {
    it('should throw REFRESH_TOKEN_INVALID', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        makeRefreshToken({ revoked: true }),
      );

      await expect(useCase.execute('revoked-token')).rejects.toThrow(
        AppErrors.REFRESH_TOKEN_INVALID,
      );
    });
  });

  describe('when token is expired', () => {
    it('should throw REFRESH_TOKEN_INVALID', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        makeRefreshToken({ expiresAt: new Date('2020-01-01') }),
      );

      await expect(useCase.execute('expired-token')).rejects.toThrow(
        AppErrors.REFRESH_TOKEN_INVALID,
      );
    });
  });

  describe('when token does not exist', () => {
    it('should throw REFRESH_TOKEN_INVALID', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(null);

      await expect(useCase.execute('unknown-token')).rejects.toThrow(
        AppErrors.REFRESH_TOKEN_INVALID,
      );
    });
  });

  describe('when user no longer exists', () => {
    it('should throw USER_NOT_FOUND', async () => {
      refreshTokenRepository.findByTokenHash.mockResolvedValue(
        makeRefreshToken(),
      );
      userRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('valid-token')).rejects.toThrow(
        AppErrors.USER_NOT_FOUND,
      );
    });
  });
});
