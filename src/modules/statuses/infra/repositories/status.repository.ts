import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/database/prisma.service';
import { IStatusRepository } from '../../domain/repositories/status.repository.interface';
import { StatusEntity } from '../../domain/entities/status.entity';

@Injectable()
export class StatusRepository implements IStatusRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(status: any): StatusEntity {
    return new StatusEntity(
      status.id,
      status.name,
      status.color,
      status.order,
      status.isDefault,
      status.userId,
      status.createdAt,
      status.updatedAt,
    );
  }

  async findAllByUserId(userId: string): Promise<StatusEntity[]> {
    const statuses = await this.prisma.status.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    });
    return statuses.map(this.toEntity);
  }

  async findById(id: string): Promise<StatusEntity | null> {
    const status = await this.prisma.status.findUnique({ where: { id } });
    if (!status) return null;
    return this.toEntity(status);
  }

  async create(data: {
    name: string;
    color: string;
    order: number;
    userId: string;
    isDefault?: boolean;
  }): Promise<StatusEntity> {
    const status = await this.prisma.status.create({ data });
    return this.toEntity(status);
  }

  async update(
    id: string,
    data: { name?: string; color?: string; order?: number },
  ): Promise<StatusEntity> {
    const status = await this.prisma.status.update({ where: { id }, data });
    return this.toEntity(status);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.status.delete({ where: { id } });
  }
}
