import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/database/prisma.service';
import { IKanbanRepository } from '../../domain/repositories/kanban.repository.interface';
import { LeadEntity } from '../../../leads/domain/entities/lead.entity';

@Injectable()
export class KanbanRepository implements IKanbanRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toLeadEntity(lead: any): LeadEntity {
    return new LeadEntity(
      lead.id,
      lead.name,
      lead.email,
      lead.phone,
      lead.type,
      lead.propertyType,
      lead.city,
      lead.neighborhood,
      lead.budgetMin ? Number(lead.budgetMin) : null,
      lead.budgetMax ? Number(lead.budgetMax) : null,
      lead.origin,
      lead.notes,
      lead.userId,
      lead.statusId,
      lead.createdAt,
      lead.updatedAt,
    );
  }

  async findAllByUserId(userId: string) {
    const statuses = await this.prisma.status.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: {
        leads: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return statuses.map((status) => ({
      id: status.id,
      name: status.name,
      color: status.color,
      order: status.order,
      leads: status.leads.map(this.toLeadEntity),
    }));
  }

  async moveLead(leadId: string, statusId: string): Promise<LeadEntity> {
    const lead = await this.prisma.lead.update({
      where: { id: leadId },
      data: { statusId },
    });
    return this.toLeadEntity(lead);
  }
}
