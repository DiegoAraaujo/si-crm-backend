import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/database/prisma.service';

@Injectable()
export class GetDashboardUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLeads,
      newLeads,
      statuses,
      recentLeads,
      recentActivities,
      originDistribution,
      propertyTypeDistribution,
      typeDistribution,
    ] = await Promise.all([
      this.prisma.lead.count({ where: { userId } }),
      this.prisma.lead.count({
        where: { userId, createdAt: { gte: startOfMonth } },
      }),
      this.prisma.status.findMany({
        where: { userId },
        orderBy: { order: 'asc' },
        include: { _count: { select: { leads: true } } },
      }),
      this.prisma.lead.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { status: true },
      }),
      this.prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { lead: true },
      }),
      this.prisma.lead.groupBy({
        by: ['origin'],
        where: { userId },
        _count: { origin: true },
        orderBy: { _count: { origin: 'desc' } },
      }),
      this.prisma.lead.groupBy({
        by: ['propertyType'],
        where: { userId },
        _count: { propertyType: true },
        orderBy: { _count: { propertyType: 'desc' } },
      }),
      this.prisma.lead.groupBy({
        by: ['type'],
        where: { userId },
        _count: { type: true },
      }),
    ]);

    const boardDistribution = statuses.map((s) => ({
      name: s.name,
      color: s.color,
      count: s._count.leads,
    }));

    const topStatus = boardDistribution.reduce(
      (prev, curr) => (curr.count > prev.count ? curr : prev),
      { name: '—', color: '#888', count: 0 },
    );

    return {
      stats: {
        totalLeads,
        newLeads,
        topStatus: topStatus.name,
        topStatusColor: topStatus.color,
      },
      boardDistribution,
      originDistribution: originDistribution.map((o) => ({
        name: o.origin,
        count: o._count.origin,
      })),
      propertyTypeDistribution: propertyTypeDistribution
        .slice(0, 5)
        .map((p) => ({
          name: p.propertyType,
          count: p._count.propertyType,
        })),
      typeDistribution: typeDistribution.map((t) => ({
        name: t.type,
        count: t._count.type,
      })),
      recentLeads: recentLeads.map((l) => ({
        id: l.id,
        name: l.name,
        propertyType: l.propertyType,
        city: l.city,
        statusName: l.status.name,
        statusColor: l.status.color,
        createdAt: l.createdAt,
      })),
      recentActivities: recentActivities.map((a) => ({
        id: a.id,
        action: a.action,
        leadName: a.lead.name,
        createdAt: a.createdAt,
      })),
    };
  }
}
