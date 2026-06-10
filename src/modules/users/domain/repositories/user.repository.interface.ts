import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserEntity>;
  update(id: string, data: { name?: string }): Promise<UserEntity>;
}
