import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { JwtService } from '@nestjs/jwt';
interface RefreshOutput {
    accessToken: string;
    refreshToken: string;
}
export declare class RefreshUseCase {
    private readonly refreshTokenRepository;
    private readonly userRepository;
    private readonly jwtService;
    constructor(refreshTokenRepository: IRefreshTokenRepository, userRepository: IUserRepository, jwtService: JwtService);
    execute(token: string): Promise<RefreshOutput>;
}
export {};
