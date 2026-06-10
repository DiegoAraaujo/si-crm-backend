import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
export declare class LogoutUseCase {
    private readonly refreshTokenRepository;
    constructor(refreshTokenRepository: IRefreshTokenRepository);
    execute(token: string): Promise<void>;
}
