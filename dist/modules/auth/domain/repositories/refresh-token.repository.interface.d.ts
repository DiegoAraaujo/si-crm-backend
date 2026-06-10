import { RefreshTokenEntity } from '../entities/refresh-token.entity';
export interface IRefreshTokenRepository {
    create(data: {
        tokenHash: string;
        userId: string;
        expiresAt: Date;
    }): Promise<RefreshTokenEntity>;
    findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null>;
    revokeByTokenHash(tokenHash: string): Promise<void>;
    revokeAllByUserId(userId: string): Promise<void>;
}
