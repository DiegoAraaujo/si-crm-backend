import { StatusEntity } from '../entities/status.entity';

export interface IStatusRepository {
  findAllByUserId(userId: string): Promise<StatusEntity[]>;
  findById(id: string): Promise<StatusEntity | null>;
  findDefaultByUserId(userId: string): Promise<StatusEntity | null>;
  create(data: {
    name: string;
    color: string;
    order: number;
    userId: string;
    isDefault?: boolean;
  }): Promise<StatusEntity>;
  update(
    id: string,
    data: { name?: string; color?: string; order?: number },
  ): Promise<StatusEntity>;
  delete(id: string): Promise<void>;
}
