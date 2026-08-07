import { RegisterUseCase } from 'src/modules/auth/application/use-cases/register.use-case';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from 'src/modules/auth/domain/repositories/refresh-token.repository.interface';
import { IStatusRepository } from 'src/modules/statuses/domain/repositories/status.repository.interface';
import { JwtService } from '@nestjs/jwt';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { RefreshTokenEntity } from 'src/modules/auth/domain/entities/refresh-token.entity';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashed-password'),
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

const makeStatusRepository = (): jest.Mocked<IStatusRepository> => ({
  findAllByUserId: jest.fn(),
  findById: jest.fn(),
  findDefaultByUserId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeJwtService = (): jest.Mocked<JwtService> =>
  ({ sign: jest.fn().mockReturnValue('access-token-mock') }) as any;

describe('RegisterUseCase', () => {
  let useCase: RegisterUseCase;
  let userRepository: jest.Mocked<IUserRepository>;
  let refreshTokenRepository: jest.Mocked<IRefreshTokenRepository>;
  let statusRepository: jest.Mocked<IStatusRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    userRepository = makeUserRepository();
    refreshTokenRepository = makeRefreshTokenRepository();
    statusRepository = makeStatusRepository();
    jwtService = makeJwtService();
    jest.clearAllMocks();

    useCase = new RegisterUseCase(
      userRepository,
      refreshTokenRepository,
      statusRepository,
      jwtService,
    );
  });

  describe('when email is not in use', () => {
    beforeEach(() => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(makeUser());
      refreshTokenRepository.create.mockResolvedValue(makeRefreshToken());
      statusRepository.create.mockResolvedValue({} as any);
    });

    it('should return accessToken, refreshToken and user', async () => {
      const result = await useCase.execute({
        name: 'John Doe',
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

    it('should hash the password before saving', async () => {
      await useCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(bcrypt.hash as jest.Mock).toHaveBeenCalledWith('password123', 10);
    });

    it('should not return password in user output', async () => {
      const result = await useCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(result.user).not.toHaveProperty('password');
    });

    it('should create a default status for the new user', async () => {
      await useCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(statusRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user-id-123',
          isDefault: true,
        }),
      );
    });

    it('should store a hashed refresh token, not the raw token', async () => {
      await useCase.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const callArg = refreshTokenRepository.create.mock.calls[0][0];
      expect(callArg.tokenHash).toBeDefined();
      expect(callArg.tokenHash).not.toHaveLength(36);
    });
  });

  describe('when email is already in use', () => {
    it('should throw USER_ALREADY_EXISTS', async () => {
      userRepository.findByEmail.mockResolvedValue(makeUser());

      await expect(
        useCase.execute({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(AppErrors.USER_ALREADY_EXISTS);
    });

    it('should not create user or status if email exists', async () => {
      userRepository.findByEmail.mockResolvedValue(makeUser());

      await expect(
        useCase.execute({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow();

      expect(userRepository.create).not.toHaveBeenCalled();
      expect(statusRepository.create).not.toHaveBeenCalled();
    });
  });
});
