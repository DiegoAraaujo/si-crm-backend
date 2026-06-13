import { LeadEntity } from '../entities/lead.entity';

export interface ILeadRepository {
  findAllByUserId(
    userId: string,
    filters?: { statusId?: string; origin?: string; search?: string },
  ): Promise<LeadEntity[]>;
  findById(id: string): Promise<LeadEntity | null>;
  create(data: {
    name: string;
    email?: string;
    phone?: string;
    type: string;
    propertyType: string;
    city?: string;
    neighborhood?: string;
    budgetMin?: number;
    budgetMax?: number;
    origin: string;
    notes?: string;
    userId: string;
    statusId: string;
  }): Promise<LeadEntity>;
  update(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      type?: string;
      propertyType?: string;
      city?: string;
      neighborhood?: string;
      budgetMin?: number;
      budgetMax?: number;
      origin?: string;
      notes?: string;
      statusId?: string;
    },
  ): Promise<LeadEntity>;
  delete(id: string): Promise<void>;
}
