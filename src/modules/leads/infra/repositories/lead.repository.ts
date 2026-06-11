import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infra/database/prisma.service';
import { ILeadRepository } from '../../domain/repositories/lead.repository.interface';
import { LeadEntity } from '../../domain/entities/lead.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeadRepository implements ILeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(lead: any): LeadEntity {
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

  async findAllByUserId(
    userId: string,
    filters?: { statusId?: string; origin?: string; search?: string },
  ): Promise<LeadEntity[]> {
    const where: Prisma.LeadWhereInput = { userId };

    if (filters?.statusId) where.statusId = filters.statusId;
    if (filters?.origin) where.origin = filters.origin as any;
    if (filters?.search)
      where.name = { contains: filters.search, mode: 'insensitive' };

    const leads = await this.prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return leads.map(this.toEntity);
  }

  async findById(id: string): Promise<LeadEntity | null> {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) return null;
    return this.toEntity(lead);
  }

  async create(data: any): Promise<LeadEntity> {
    const lead = await this.prisma.lead.create({ data });
    return this.toEntity(lead);
  }

  async update(id: string, data: any): Promise<LeadEntity> {
    const lead = await this.prisma.lead.update({ where: { id }, data });
    return this.toEntity(lead);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lead.delete({ where: { id } });
  }
}
