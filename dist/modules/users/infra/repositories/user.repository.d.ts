import { PrismaService } from '../../../../shared/infra/database/prisma.service';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
export declare class UserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<UserEntity>;
    update(id: string, data: {
        name?: string;
    }): Promise<UserEntity>;
}
