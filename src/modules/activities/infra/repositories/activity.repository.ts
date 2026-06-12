import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/database/prisma.service';
import { IActivityRepository } from '../../domain/repositories/activity.repository.interface';
import { ActivityEntity } from '../../domain/entities/activity.entity';

@Injectable()
export class ActivityRepository implements IActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(activity: any): ActivityEntity {
    return new ActivityEntity(
      activity.id,
      activity.action,
      activity.leadId,
      activity.userId,
      activity.createdAt,
    );
  }

  async findAll(userId: string, leadId?: string): Promise<ActivityEntity[]> {
    const activities = await this.prisma.activity.findMany({
      where: {
        userId,
        ...(leadId ? { leadId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return activities.map(this.toEntity);
  }

  async create(data: {
    action: string;
    leadId: string;
    userId: string;
  }): Promise<ActivityEntity> {
    const activity = await this.prisma.activity.create({ data });
    return this.toEntity(activity);
  }
}
