import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { JwtService } from '@nestjs/jwt';
interface RegisterInput {
    name: string;
    email: string;
    password: string;
}
interface RegisterOutput {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}
export declare class RegisterUseCase {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly jwtService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, jwtService: JwtService);
    execute(input: RegisterInput): Promise<RegisterOutput>;
}
export {};
