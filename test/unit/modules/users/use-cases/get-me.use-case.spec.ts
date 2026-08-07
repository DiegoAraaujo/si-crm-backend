import { GetMeUseCase } from 'src/modules/users/application/use-cases/get-me.use-case';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';

const makeUser = (overrides?: Partial<UserEntity>): UserEntity =>
  new UserEntity(
    overrides?.id ?? 'user-id-123',
    overrides?.name ?? 'John Doe',
    overrides?.email ?? 'john@example.com',
    overrides?.password ?? 'hashed-password',
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.updatedAt ?? new Date('2024-01-01'),
  );

const makeUserRepository = (): jest.Mocked<IUserRepository> => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe('GetMeUseCase', () => {
  let useCase: GetMeUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = makeUserRepository();
    useCase = new GetMeUseCase(userRepository);
  });

  describe('when user exists', () => {
    it('should return user data without password', async () => {
      userRepository.findById.mockResolvedValue(makeUser());

      const result = await useCase.execute('user-id-123');

      expect(result).toEqual({
        id: 'user-id-123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date('2024-01-01'),
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should call repository with the correct userId', async () => {
      userRepository.findById.mockResolvedValue(makeUser());

      await useCase.execute('user-id-123');

      expect(userRepository.findById).toHaveBeenCalledWith('user-id-123');
      expect(userRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('when user does not exist', () => {
    it('should throw AppErrors.USER_NOT_FOUND', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('unknown-id')).rejects.toThrow(
        AppErrors.USER_NOT_FOUND,
      );
    });

    it('should throw error with status 404 and correct code', async () => {
      userRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute('unknown-id');
      } catch (error: any) {
        expect(error.status).toBe(404);
        expect(error.code).toBe('USER_NOT_FOUND');
      }
    });
  });
});
