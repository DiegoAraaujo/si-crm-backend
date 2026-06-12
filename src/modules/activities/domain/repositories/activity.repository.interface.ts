import { ActivityEntity } from '../entities/activity.entity';

export interface IActivityRepository {
  findAll(userId: string, leadId?: string): Promise<ActivityEntity[]>;
  create(data: {
    action: string;
    leadId: string;
    userId: string;
  }): Promise<ActivityEntity>;
}
