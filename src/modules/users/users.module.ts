import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/infra/database/prisma.service';
import { UserRepository } from './infra/repositories/user.repository';

@Module({
  providers: [
    PrismaService,
    UserRepository,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}
