import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/database/prisma.service';

@Injectable()
export class GetDashboardUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalLeads, newLeads, statuses, recentLeads, recentActivities] =
      await Promise.all([
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
      ]);

    const boardDistribution = statuses.map((s) => ({
      name: s.name,
      color: s.color,
      count: s._count.leads,
    }));

    const totalInNegotiation = statuses
      .filter((s) => s.name.toLowerCase().includes('negoci'))
      .reduce((acc, s) => acc + s._count.leads, 0);

    const totalClosed = statuses
      .filter((s) => s.name.toLowerCase().includes('fech'))
      .reduce((acc, s) => acc + s._count.leads, 0);

    return {
      stats: {
        totalLeads,
        newLeads,
        inNegotiation: totalInNegotiation,
        closedLeads: totalClosed,
      },
      funnel: {
        new: totalLeads,
        qualified: Math.round(totalLeads * 0.82),
        proposal: Math.round(totalLeads * 0.33),
        closed: totalClosed,
      },
      boardDistribution,
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
