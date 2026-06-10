import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/database/prisma.service';
import type { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
  }): Promise<RefreshTokenEntity> {
    const token = await this.prisma.refreshToken.create({ data });
    return new RefreshTokenEntity(
      token.id,
      token.tokenHash,
      token.userId,
      token.expiresAt,
      token.revoked,
      token.createdAt,
    );
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshTokenEntity | null> {
    const token = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });
    if (!token) return null;
    return new RefreshTokenEntity(
      token.id,
      token.tokenHash,
      token.userId,
      token.expiresAt,
      token.revoked,
      token.createdAt,
    );
  }

  async revokeByTokenHash(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash },
      data: { revoked: true },
    });
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });
  }
}
