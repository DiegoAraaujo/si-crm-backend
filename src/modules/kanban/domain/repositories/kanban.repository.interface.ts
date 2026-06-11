import { LeadEntity } from '../../../leads/domain/entities/lead.entity';

export interface IKanbanRepository {
  findAllByUserId(userId: string): Promise<
    {
      id: string;
      name: string;
      color: string;
      order: number;
      leads: LeadEntity[];
    }[]
  >;
  moveLead(leadId: string, statusId: string): Promise<LeadEntity>;
}
