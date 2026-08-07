import { UpdateMeUseCase } from 'src/modules/users/application/use-cases/update-me.use-case';
import { IUserRepository } from 'src/modules/users/domain/repositories/user.repository.interface';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';

const makeUser = (overrides?: Partial<UserEntity>): UserEntity =>
  new UserEntity(
    overrides?.id ?? 'user-id-123',
    overrides?.name ?? 'John Doe',
    overrides?.email ?? 'john@example.com',
    overrides?.password ?? 'hashed-password',
    overrides?.createdAt ?? new Date('2024-01-01'),
    overrides?.updatedAt ?? new Date('2024-06-01'),
  );

const makeUserRepository = (): jest.Mocked<IUserRepository> => ({
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

describe('UpdateMeUseCase', () => {
  let useCase: UpdateMeUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = makeUserRepository();
    useCase = new UpdateMeUseCase(userRepository);
  });

  describe('when user exists', () => {
    it('should update and return data without password', async () => {
      userRepository.findById.mockResolvedValue(makeUser({ name: 'John Doe' }));
      userRepository.update.mockResolvedValue(
        makeUser({ name: 'John Updated' }),
      );

      const result = await useCase.execute({
        userId: 'user-id-123',
        name: 'John Updated',
      });

      expect(result).toEqual({
        id: 'user-id-123',
        name: 'John Updated',
        email: 'john@example.com',
        updatedAt: makeUser().updatedAt,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should call update with correct userId and name', async () => {
      userRepository.findById.mockResolvedValue(makeUser());
      userRepository.update.mockResolvedValue(makeUser({ name: 'New Name' }));

      await useCase.execute({ userId: 'user-id-123', name: 'New Name' });

      expect(userRepository.update).toHaveBeenCalledWith('user-id-123', {
        name: 'New Name',
      });
    });

    it('should check user existence before updating', async () => {
      userRepository.findById.mockResolvedValue(makeUser());
      userRepository.update.mockResolvedValue(makeUser());

      await useCase.execute({ userId: 'user-id-123', name: 'Any Name' });

      const findOrder = userRepository.findById.mock.invocationCallOrder[0];
      const updateOrder = userRepository.update.mock.invocationCallOrder[0];
      expect(findOrder).toBeLessThan(updateOrder);
    });
  });

  describe('when user does not exist', () => {
    it('should throw USER_NOT_FOUND without calling update', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ userId: 'unknown-id', name: 'Any Name' }),
      ).rejects.toThrow(AppErrors.USER_NOT_FOUND);

      expect(userRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error with status 404', async () => {
      userRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute({ userId: 'unknown-id', name: 'Any Name' });
      } catch (error: any) {
        expect(error.status).toBe(404);
        expect(error.code).toBe('USER_NOT_FOUND');
        expect(error.message).toBe('User not found');
      }
    });
  });
});
