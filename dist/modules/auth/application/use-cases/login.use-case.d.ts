import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { JwtService } from '@nestjs/jwt';
interface LoginInput {
    email: string;
    password: string;
}
interface LoginOutput {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
export declare class LoginUseCase {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly jwtService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, jwtService: JwtService);
    execute(input: LoginInput): Promise<LoginOutput>;
}
export {};
