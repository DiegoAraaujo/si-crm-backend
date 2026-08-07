import { LoginUseCase } from 'src/modules/auth/application/use-cases/login.use-case';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { RefreshTokenEntity } from 'src/modules/auth/domain/entities/refresh-token.entity';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const makeUser = (overrides?: Partial<UserEntity>): UserEntity =>
  new UserEntity(
    overrides?.id ?? 'user-id-123',
    overrides?.name ?? 'John Doe',
    overrides?.email ?? 'john@example.com',
    overrides?.password ?? 'hashed-password',
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.updatedAt ?? new Date('2024-01-01'),
  );

const makeRefreshToken = (): RefreshTokenEntity =>
  new RefreshTokenEntity(
    'token-id',
    'token-hash',
    'user-id-123',
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    false,
    new Date(),
  );

const makeUserRepository = (): jest.Mocked<IUserRepository> => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

const makeRefreshTokenRepository =
  (): jest.Mocked<IRefreshTokenRepository> => ({
    create: jest.fn(),
    findByTokenHash: jest.fn(),
    revokeByTokenHash: jest.fn(),
    revokeAllByUserId: jest.fn(),
  });

const makeJwtService = (): jest.Mocked<JwtService> =>
  ({ sign: jest.fn().mockReturnValue('access-token-mock') }) as any;

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepository = makeUserRepository();
    refreshTokenRepository = makeRefreshTokenRepository();
    jwtService = makeJwtService();
    useCase = new LoginUseCase(
      userRepository,
      refreshTokenRepository,
      jwtService,
    );
    jest.clearAllMocks();
  });

  describe('when credentials are valid', () => {
    beforeEach(() => {
      userRepository.findByEmail.mockResolvedValue(makeUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      refreshTokenRepository.create.mockResolvedValue(makeRefreshToken());
    });

    it('should return accessToken, refreshToken and user', async () => {
      const result = await useCase.execute({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toEqual({
        id: 'user-id-123',
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should not return password in user output', async () => {
      const result = await useCase.execute({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result.user).not.toHaveProperty('password');
    });

    it('should sign jwt with correct payload', async () => {
      await useCase.execute({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-id-123',
        email: 'john@example.com',
      });
    });
  });

  describe('when user does not exist', () => {
    it('should throw INVALID_CREDENTIALS', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(
        useCase.execute({
          email: 'wrong@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(AppErrors.INVALID_CREDENTIALS);
    });
  });

  describe('when password is wrong', () => {
    it('should throw INVALID_CREDENTIALS', async () => {
      userRepository.findByEmail.mockResolvedValue(makeUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        useCase.execute({
          email: 'john@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow(AppErrors.INVALID_CREDENTIALS);
    });

    it('should not create refresh token if password is wrong', async () => {
      userRepository.findByEmail.mockResolvedValue(makeUser());
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        useCase.execute({
          email: 'john@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow();

      expect(refreshTokenRepository.create).not.toHaveBeenCalled();
    });
  });
});
