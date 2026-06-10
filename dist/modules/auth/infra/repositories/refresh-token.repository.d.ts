import { PrismaService } from '../../../../shared/infra/database/prisma.service';
import type { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';
export declare class RefreshTokenRepository implements IRefreshTokenRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: {
        tokenHash: string;
        userId: string;
        expiresAt: Date;
    }): Promise<RefreshTokenEntity>;
    findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null>;
    revokeByTokenHash(tokenHash: string): Promise<void>;
    revokeAllByUserId(userId: string): Promise<void>;
}
