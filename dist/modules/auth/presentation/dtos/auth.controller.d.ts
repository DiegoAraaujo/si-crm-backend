import type { Request, Response } from 'express';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { RefreshUseCase } from '../../application/use-cases/refresh.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RegisterDto } from './register.dto';
import { LoginDto } from './login.dto';
export declare class AuthController {
    private readonly registerUseCase;
    private readonly loginUseCase;
    private readonly refreshUseCase;
    private readonly logoutUseCase;
    constructor(registerUseCase: RegisterUseCase, loginUseCase: LoginUseCase, refreshUseCase: RefreshUseCase, logoutUseCase: LogoutUseCase);
    register(dto: RegisterDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(dto: LoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
