import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from 'src/modules/users/presentation/users.controller'
import { GetMeUseCase } from 'src/modules/users/application/use-cases/get-me.use-case'
import { UpdateMeUseCase } from 'src/modules/users/application/use-cases/update-me.use-case'
import { AppErrors } from 'src/shared/domain/errors/error-dictionary'
import { Request } from 'express'

const makeRequest = (userId = 'user-id-123'): Partial<Request> => ({
  user: { id: userId },
})

const makeMeOutput = () => ({
  id: 'user-id-123',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date('2024-01-01'),
})

const makeUpdateOutput = () => ({
  id: 'user-id-123',
  name: 'John Updated',
  email: 'john@example.com',
  updatedAt: new Date('2024-06-01'),
})

describe('UsersController', () => {
  let controller: UsersController
  let getMeUseCase: jest.Mocked<GetMeUseCase>
  let updateMeUseCase: jest.Mocked<UpdateMeUseCase>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: GetMeUseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateMeUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    getMeUseCase = module.get(GetMeUseCase)
    updateMeUseCase = module.get(UpdateMeUseCase)
  })

  describe('GET /users/me', () => {
    it('should call GetMeUseCase with the authenticated user id', async () => {
      getMeUseCase.execute.mockResolvedValue(makeMeOutput())

      await controller.getMe(makeRequest() as Request)

      expect(getMeUseCase.execute).toHaveBeenCalledWith('user-id-123')
    })

    it('should return the output from GetMeUseCase', async () => {
      const output = makeMeOutput()
      getMeUseCase.execute.mockResolvedValue(output)

      const result = await controller.getMe(makeRequest() as Request)

      expect(result).toEqual(output)
    })

    it('should propagate error if GetMeUseCase throws', async () => {
      getMeUseCase.execute.mockRejectedValue(AppErrors.USER_NOT_FOUND)

      await expect(controller.getMe(makeRequest() as Request)).rejects.toThrow(
        AppErrors.USER_NOT_FOUND,
      )
    })
  })

  describe('PATCH /users/me', () => {
    it('should call UpdateMeUseCase with correct userId and name', async () => {
      updateMeUseCase.execute.mockResolvedValue(makeUpdateOutput())

      await controller.updateMe(makeRequest() as Request, { name: 'John Updated' })

      expect(updateMeUseCase.execute).toHaveBeenCalledWith({
        userId: 'user-id-123',
        name: 'John Updated',
      })
    })

    it('should return the output from UpdateMeUseCase', async () => {
      const output = makeUpdateOutput()
      updateMeUseCase.execute.mockResolvedValue(output)

      const result = await controller.updateMe(makeRequest() as Request, { name: 'John Updated' })

      expect(result).toEqual(output)
    })

    it('should propagate error if UpdateMeUseCase throws', async () => {
      updateMeUseCase.execute.mockRejectedValue(AppErrors.USER_NOT_FOUND)

      await expect(
        controller.updateMe(makeRequest() as Request, { name: 'Any Name' }),
      ).rejects.toThrow(AppErrors.USER_NOT_FOUND)
    })
  })
})