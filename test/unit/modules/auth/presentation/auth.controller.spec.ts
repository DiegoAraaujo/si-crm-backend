import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from 'src/modules/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from 'src/modules/auth/application/use-cases/logout.use-case';
import { RefreshUseCase } from 'src/modules/auth/application/use-cases/refresh.use-case';
import { RegisterUseCase } from 'src/modules/auth/application/use-cases/register.use-case';
import { AuthController } from 'src/modules/auth/presentation/dtos/auth.controller';
import { AppErrors } from 'src/shared/domain/errors/error-dictionary';

describe('AuthController', () => {
  let controller: AuthController;
  let registerUseCase: jest.Mocked<RegisterUseCase>;
  let loginUseCase: jest.Mocked<LoginUseCase>;
  let refreshUseCase: jest.Mocked<RefreshUseCase>;
  let logoutUseCase: jest.Mocked<LogoutUseCase>;

  const mockResponse = () => {
    const res: any = {};
    res.cookie = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: RegisterUseCase, useValue: { execute: jest.fn() } },
        { provide: LoginUseCase, useValue: { execute: jest.fn() } },
        { provide: RefreshUseCase, useValue: { execute: jest.fn() } },
        { provide: LogoutUseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    controller = module.get(AuthController);
    registerUseCase = module.get(RegisterUseCase);
    loginUseCase = module.get(LoginUseCase);
    refreshUseCase = module.get(RefreshUseCase);
    logoutUseCase = module.get(LogoutUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and set refresh token cookie', async () => {
      const dto = {
        name: 'Diego',
        email: 'diego@test.com',
        password: '123456',
      };
      const result = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: '1', name: 'Diego', email: 'diego@test.com' },
      };
      registerUseCase.execute.mockResolvedValue(result as any);
      const res = mockResponse();

      await controller.register(dto as any, res);

      expect(registerUseCase.execute).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        result.refreshToken,
        expect.objectContaining({ httpOnly: true, sameSite: 'strict' }),
      );
      expect(res.json).toHaveBeenCalledWith({
        accessToken: result.accessToken,
        user: result.user,
      });
    });
  });

  describe('login', () => {
    it('should log in a user and set refresh token cookie', async () => {
      const dto = { email: 'diego@test.com', password: '123456' };
      const result = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: '1', name: 'Diego', email: 'diego@test.com' },
      };
      loginUseCase.execute.mockResolvedValue(result as any);
      const res = mockResponse();

      await controller.login(dto as any, res);

      expect(loginUseCase.execute).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        result.refreshToken,
        expect.objectContaining({ httpOnly: true, sameSite: 'strict' }),
      );
      expect(res.json).toHaveBeenCalledWith({
        accessToken: result.accessToken,
        user: result.user,
      });
    });
  });

  describe('refresh', () => {
    it('should refresh tokens when cookie is present', async () => {
      const req: any = { cookies: { refresh_token: 'old-refresh-token' } };
      const result = { accessToken: 'new-access', refreshToken: 'new-refresh' };
      refreshUseCase.execute.mockResolvedValue(result as any);
      const res = mockResponse();

      await controller.refresh(req, res);

      expect(refreshUseCase.execute).toHaveBeenCalledWith('old-refresh-token');
      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        result.refreshToken,
        expect.objectContaining({ httpOnly: true, sameSite: 'strict' }),
      );
      expect(res.json).toHaveBeenCalledWith({
        accessToken: result.accessToken,
      });
    });

    it('should throw when refresh token cookie is missing', async () => {
      const req: any = { cookies: {} };
      const res = mockResponse();

      await expect(controller.refresh(req, res)).rejects.toEqual(
        AppErrors.REFRESH_TOKEN_INVALID,
      );
      expect(refreshUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should log out and clear the refresh token cookie', async () => {
      const req: any = { cookies: { refresh_token: 'refresh-token' } };
      logoutUseCase.execute.mockResolvedValue(undefined as any);
      const res = mockResponse();
      res.clearCookie = jest.fn().mockReturnValue(res);

      await controller.logout(req, res);

      expect(logoutUseCase.execute).toHaveBeenCalledWith('refresh-token');
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should throw when refresh token cookie is missing', async () => {
      const req: any = { cookies: {} };
      const res = mockResponse();

      await expect(controller.logout(req, res)).rejects.toEqual(
        AppErrors.REFRESH_TOKEN_INVALID,
      );
      expect(logoutUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
